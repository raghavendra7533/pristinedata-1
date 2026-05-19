import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

export function ICPSummaryPanel() {
  const navigate = useNavigate();
  const icp = useUserProfileStore((s) => s.profile?.icp);
  const isEmpty = !icp || icp.industries.length === 0;

  return (
    <div className="rounded-lg border p-4" style={{ borderColor: "var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Your ICP</span>
        <button
          onClick={() => navigate("/si/icp")}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
        >
          <Icon icon="solar:pen-2-linear" width={12} />
          Edit
        </button>
      </div>

      {isEmpty ? (
        <div className="text-xs text-gray-400 leading-relaxed">
          Configure your ICP to improve signal targeting.
          <button onClick={() => navigate("/si/icp")} className="block text-indigo-600 font-medium mt-1 hover:underline">
            Set up ICP →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {icp.industries.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Industries</span>
              <p className="text-xs text-gray-600 mt-0.5">{icp.industries.slice(0, 3).join(", ")}{icp.industries.length > 3 ? ` +${icp.industries.length - 3}` : ""}</p>
            </div>
          )}
          {(icp.employeeMin || icp.employeeMax) && (
            <div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Company Size</span>
              <p className="text-xs text-gray-600 mt-0.5">{icp.employeeMin.toLocaleString()}–{icp.employeeMax.toLocaleString()} employees</p>
            </div>
          )}
          {icp.geographies.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Geographies</span>
              <p className="text-xs text-gray-600 mt-0.5">{icp.geographies.join(", ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
