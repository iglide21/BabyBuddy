"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Ruler,
  Weight,
  Heart,
  Stethoscope,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Pill,
  Baby,
  FileText,
  Edit,
  TrendingUp,
  Settings,
} from "lucide-react";
import EditBabySettingModal from "@/src/components/baby/edit-baby-setting-modal";
import { useBabyFromUrl } from "@/src/hooks";
import dayjs, { calculateAge } from "@/src/lib/dayjs";
import { useApplicationStore } from "@/src/stores";
import { BabySettingSection } from "@/types/baby";
import InnerPageHeader from "@/src/components/inner-page-header";

const BabySettings = () => {
  const { currentBaby } = useBabyFromUrl();
  const showModal = useApplicationStore.use.showModal() as (modal: {
    type: "edit_baby_setting";
    data: {
      babyId: string;
      sectionType: BabySettingSection;
    };
  }) => void;
  //   if (!selectedSection) return null;

  //   const data = generateGrowthData(selectedSection);
  //   if (data.length === 0) {
  //     return (
  //       <div className="text-center py-8 text-gray-500">
  //         <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
  //         <p>No history data available for this section.</p>
  //       </div>
  //     );
  //   }
  //   return (
  //     <div className="space-y-4">
  //       <ResponsiveContainer width="100%" height={300}>
  //         <AreaChart data={data}>
  //           <CartesianGrid strokeDasharray="3 3" />
  //           <XAxis dataKey="date" />
  //           <YAxis />
  //           <Tooltip />
  //           <Area
  //             type="monotone"
  //             dataKey="value"
  //             stroke="#8884d8"
  //             fill="#8884d8"
  //             fillOpacity={0.3}
  //           />
  //         </AreaChart>
  //       </ResponsiveContainer>

  //       <div className="space-y-2">
  //         <h4 className="font-semibold">Change History</h4>
  //         {getFieldHistory(selectedSection).map((change) => (
  //           <div
  //             key={change.id}
  //             className="flex justify-between items-center p-2 bg-gray-50 rounded"
  //           >
  //             <div>
  //               <span className="font-medium">{change.newValue}</span>
  //               <span className="text-sm text-gray-500 ml-2">
  //                 by {change.changedBy}
  //               </span>
  //             </div>
  //             <span className="text-xs text-gray-400">
  //               {new Date(change.changedAt).toLocaleDateString()}
  //             </span>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <InnerPageHeader
        title="Settings"
        icon={<Settings className="w-5 h-5 text-gray-600" />}
      />

      {/* Profile Overview */}
      <Card className="border-pink-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">
              {currentBaby?.gender === "male" ? "👦" : "👧"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {currentBaby?.name}
              </h2>
              <p className="text-lg text-gray-600">
                {currentBaby?.birth_date &&
                  calculateAge(currentBaby?.birth_date)}
              </p>
              <p className="text-sm text-gray-500">
                Born: {dayjs(currentBaby?.birth_date).format("DD MMM YYYY")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Birth Information */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Birth Information
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-red-200">
              <Weight className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-gray-800">
                {currentBaby?.birth_weight
                  ? `${currentBaby?.birth_weight} kg`
                  : "Not set"}
              </div>
              <div className="text-sm text-gray-600">Birth Weight</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-red-200">
              <Ruler className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-gray-800">
                {currentBaby?.birth_length
                  ? `${currentBaby?.birth_length} cm`
                  : "Not set"}
              </div>
              <div className="text-sm text-gray-600">Birth Length</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-500 mb-2">🩸</div>
              <div className="text-2xl font-bold text-gray-800">
                {currentBaby?.blood_type || "Not set"}
              </div>
              <div className="text-sm text-gray-600">Blood Type</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Measurements */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-blue-500" />
              Current Measurements
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <Weight className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-gray-800">
                {currentBaby?.current_weight
                  ? `${currentBaby?.current_weight} kg`
                  : "Not set"}
              </div>
              <div className="text-sm text-gray-600">Current Weight</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <Ruler className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-gray-800">
                {currentBaby?.current_length
                  ? `${currentBaby?.current_length} cm`
                  : "Not set"}
              </div>
              <div className="text-sm text-gray-600">Current Length</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <Baby className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-gray-800">
                {currentBaby?.head_circumference
                  ? `${currentBaby?.head_circumference} cm`
                  : "Not set"}
              </div>
              <div className="text-sm text-gray-600">Head Circumference</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-white border-blue-200"
            onClick={() =>
              showModal({
                type: "edit_baby_setting",
                data: {
                  babyId: currentBaby?.id || "",
                  sectionType: "current_measurements",
                },
              })
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-green-500" />
              Medical Information
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Allergies & Medications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <h4 className="font-semibold text-gray-800">Allergies</h4>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                {currentBaby?.allergies && currentBaby?.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentBaby?.allergies.map((allergy, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-orange-100 text-orange-700"
                      >
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No known allergies</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-500" />
                <h4 className="font-semibold text-gray-800">Medications</h4>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                {currentBaby?.medications &&
                currentBaby?.medications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentBaby?.medications.map((medication, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        {medication}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No current medications
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-500" />
              <h4 className="font-semibold text-gray-800">Pediatrician</h4>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              {currentBaby?.pediatrician_name ||
              currentBaby?.pediatrician_phone ||
              currentBaby?.pediatrician_email ? (
                <div className="space-y-2">
                  {currentBaby?.pediatrician_name && (
                    <div className="font-medium text-gray-800">
                      {currentBaby?.pediatrician_name}
                    </div>
                  )}
                  {currentBaby?.pediatrician_phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      {currentBaby?.pediatrician_phone}
                    </div>
                  )}
                  {currentBaby?.pediatrician_email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      {currentBaby?.pediatrician_email}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No pediatrician information
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h4 className="font-semibold text-gray-800">Emergency Contact</h4>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              {currentBaby?.emergency_contact_name ? (
                <div className="space-y-2">
                  <div className="font-medium text-gray-800">
                    {currentBaby?.emergency_contact_name}
                  </div>
                  {currentBaby?.emergency_contact_relationship && (
                    <div className="text-sm text-gray-600">
                      {currentBaby?.emergency_contact_relationship}
                    </div>
                  )}
                  {currentBaby?.emergency_contact_phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      {currentBaby?.emergency_contact_phone}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No emergency contact information
                </p>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full bg-white border-green-200"
            onClick={() =>
              showModal({
                type: "edit_baby_setting",
                data: {
                  babyId: currentBaby?.id || "",
                  sectionType: "medical",
                },
              })
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Additional Notes
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            {currentBaby?.notes ? (
              <p className="text-gray-700 whitespace-pre-wrap">
                {currentBaby?.notes}
              </p>
            ) : (
              <p className="text-gray-500 text-sm">No additional notes</p>
            )}
          </div>
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-white border-purple-200"
            onClick={() =>
              showModal({
                type: "edit_baby_setting",
                data: {
                  babyId: currentBaby?.id || "",
                  sectionType: "notes",
                },
              })
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardContent>
      </Card>

      <EditBabySettingModal />
    </div>
  );
};

export default BabySettings;
