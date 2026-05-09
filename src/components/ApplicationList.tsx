import { useCallback, useEffect, useMemo, useState } from "react";

type Application = {
  hardshipId: number;
  name: string;
  reason: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};
export const ApplicationList = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Application[]>([]);
  const [searchByName, setSearchByName] = useState("");
  const [status, setStatus] = useState("");

  // call backend to get the list of result, and set to data
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setError(null);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/hardship`,
          {
            method: "GET",
          },
        );
        const json = await res.json();
        if (!res.ok) {
          setError(json.message || "😢Something went wrong");
          return;
        }
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unexpected error");
      }
    };
    fetchApplication();
  }, []);

  // sync with data: useMemo
  const pendingCount = useMemo(
    () => data.filter((item) => item.status === "PENDING").length,
    [data],
  );

  const approvedcount = useMemo(
    () => data.filter((item) => item.status === "APPROVED").length,
    [data],
  );

  const rejectedCount = useMemo(
    () => data.filter((item) => item.status === "REJECTED").length,
    [data],
  );

  const processData = useMemo(() => {
    console.log(searchByName);
    return data.filter((item: Application) => {
      // search by name
      if (
        searchByName.trim() &&
        !item.name
          .trim()
          .toLowerCase()
          .includes(searchByName.trim().toLowerCase())
      ) {
        return false;
      }
      // filter by status
      if (
        status != "All" &&
        !item.status.toLowerCase().includes(status.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [data, searchByName, status]);

  console.log(processData);

  return (
    //  hardship application
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
          Hardship Applications
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review and manage all submitted applications.
        </p>
      </div>

      {/* 4 count pannels */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {/* total*/}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            total
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {data.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </div>

        {/* pending */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            Pending
          </p>
          <p className="text-2xl font-semibold text-yellow-600">
            {pendingCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Awaiting review</p>
        </div>

        {/* approved */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            Approved
          </p>
          <p className="text-2xl font-semibold text-green-600">
            {approvedcount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Awaiting review</p>
        </div>

        {/* reject */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            Rejected
          </p>
          <p className="text-2xl font-semibold text-red-600">{rejectedCount}</p>
          <p className="text-xs text-gray-400 mt-1">Awaiting review</p>
        </div>
      </div>

      {/* table pannel */}
      <div className="px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
            <span className="text-gray-400">🔍</span>
            {/* search toolbar */}
            <input
              type="text"
              value={searchByName}
              onChange={(e) => setSearchByName(e.target.value)}
              className="text-sm text-gray-900 dark:text-white bg-transparent outline-none w-full"
              placeholder="Search Applications"
            />
          </div>

          {/* filter toobar */}
          <div className="flex gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize 
            ${status === s ? "bg-steal-600 text-white" : "border border-gray-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* table list */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-400 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Applicant</th>
                <th className="px-4 py-4 text-left">Reason</th>
                <th className="px-4 py-4 text-left">Status</th>
                <th className="px-4 py-4 text-left">CreatedAt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {processData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-400 text-sm"
                  >
                    No Applications found.
                  </td>
                </tr>
              ) : (
                processData.map((item) => (
                  <tr
                    key={item.hardshipId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                      {item.reason ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          item.status === "APPROVED"
                            ? "bg-teal-50 text-teal-700"
                            : item.status === "PENDING"
                              ? "bg-yellow-50 text-yellow-700"
                              : item.status === "REJECTED"
                                ? "bg-red-50 text-red-700"
                                : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-500 dark:text-white">
                      {item.createdAt ? item.createdAt.substring(0, 10) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
