"use client";

export const OtpTips = () => (
  <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
    <h4 className="font-semibold text-yellow-800 mb-2 text-sm flex items-center gap-2">
      💡 Tips
    </h4>
    <ul className="text-xs text-yellow-700 space-y-1">
      <li>• Check your spam or junk folder</li>
      <li>• The code expires in 10 minutes</li>
      <li>• You can paste the code from your clipboard</li>
    </ul>
  </div>
);

export default OtpTips;
