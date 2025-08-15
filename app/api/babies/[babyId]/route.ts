import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { BabyProfileHistory, UpdateBaby } from "@/types/data/babies/types";

export const GET = async (
  _: NextRequest,
  { params }: { params: { babyId: string } }
) => {
  const babyId = (await params).babyId;

  if (!babyId) {
    return NextResponse.json({ error: "Baby ID is required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("babies")
    .select()
    .eq("id", babyId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { babyId: string } }
) => {
  const babyId = (await params).babyId;

  if (!babyId) {
    return NextResponse.json({ error: "Baby ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { currentValues, previousValues } = body;

    if (!currentValues) {
      return NextResponse.json(
        { error: "You should provide current values!" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 1. Update the babies table with current values (snapshot)
    const { data: updatedBaby, error: babyError } = await supabase
      .from("babies")
      .update(currentValues)
      .eq("id", babyId)
      .select()
      .single();

    if (babyError) {
      return NextResponse.json({ error: babyError.message }, { status: 500 });
    }

    // 2. Handle numeric measurements (weight_kg, length_cm, head_circumference)
    const measurementFields = [
      "current_weight",
      "current_length",
      "head_circumference",
    ];
    const measurementInserts = [];

    for (const field of measurementFields) {
      const currentValue = currentValues[field as keyof typeof currentValues];
      const previousValue =
        previousValues?.[field as keyof typeof previousValues];

      const shouldInsert =
        currentValue !== previousValue &&
        currentValue !== null &&
        currentValue !== undefined;

      if (shouldInsert) {
        const measurementData = {
          baby_id: babyId,
          user_id: userId,
          measured_at: new Date().toISOString(),
          [field === "current_weight"
            ? "weight_kg"
            : field === "current_length"
            ? "length_cm"
            : "head-circumference_cm"]: currentValue,
        };

        measurementInserts.push(measurementData);
      }
    }

    // Insert measurement records if any
    if (measurementInserts.length > 0) {
      const { error: measurementError } = await supabase
        .from("baby_measurements")
        .insert(measurementInserts);

      if (measurementError) {
        console.error("Error inserting measurements:", measurementError);
        // Don't fail the entire request for measurement errors
      }
    }

    // 3. Handle text/array fields for profile history
    const textFields = [
      "blood_type",
      "notes",
      "allergies",
      "medications",
      "pediatrician_name",
      "pediatrician_phone",
      "pediatrician_email",
      "emergency_contact_name",
      "emergency_contact_relationship",
      "emergency_contact_phone",
    ];

    const historyInserts: Array<Omit<BabyProfileHistory, "id">> = [];

    for (const field of textFields) {
      const currentValue = currentValues[field as keyof typeof currentValues];

      if (currentValue === null || currentValue === undefined) {
        continue;
      }

      const previousValue =
        previousValues?.[field as keyof typeof previousValues];

      if (currentValue !== previousValue) {
        // Determine section based on field
        let section: "medical" | "notes" | "birth";
        if (
          [
            "blood_type",
            "allergies",
            "medications",
            "pediatrician_name",
            "pediatrician_phone",
            "pediatrician_email",
            "emergency_contact_name",
            "emergency_contact_relationship",
            "emergency_contact_phone",
          ].includes(field)
        ) {
          section = "medical";
        } else if (["notes"].includes(field)) {
          section = "notes";
        } else {
          section = "birth";
        }

        // Determine value type
        let valueType: BabyProfileHistory["value_type"];
        if (Array.isArray(currentValue) || Array.isArray(previousValue)) {
          valueType = "array";
        } else {
          valueType = "string";
        }

        const shouldInsert =
          currentValue !== previousValue &&
          currentValue !== null &&
          currentValue !== undefined;

        if (shouldInsert) {
          const historyData = {
            baby_id: babyId,
            user_id: userId,
            section,
            field,
            old_value: JSON.stringify(previousValue),
            new_value: JSON.stringify(currentValue),
            value_type: valueType,
            changed_at: new Date().toISOString(),
          };

          historyInserts.push(historyData);
        }
      }
    }

    // Insert history records if any
    if (historyInserts.length > 0) {
      const { error: historyError } = await supabase
        .from("baby_profile_history")
        .insert(historyInserts);

      if (historyError) {
        console.error("Error inserting history:", historyError);
        // Don't fail the entire request for history errors
      }
    }

    return NextResponse.json(updatedBaby);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
};
