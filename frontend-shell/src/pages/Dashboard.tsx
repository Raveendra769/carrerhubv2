import { useState, useEffect } from "react";
import CandidateCard from "../components/CandidateCard";
import { DndContext, useDroppable } from "@dnd-kit/core";
import type { Candidate } from "../types/candidate";
import { Navigate } from "react-router-dom";

function Column({ id, title, children }: any) {
  const { setNodeRef } = useDroppable({ id });

  const borderColor =
    id === "Applied"
      ? "border-blue-500"
      : id === "Interview"
      ? "border-yellow-500"
      : "border-green-500";

  return (
    <div
      ref={setNodeRef}
      className={`bg-white/90 p-5 rounded-2xl shadow-xl border ${borderColor} hover:shadow-2xl transition-all duration-300`}
    >
      <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
        {title}
      </h2>

      <div className="max-h-[500px] overflow-y-auto space-y-4 pr-1">
        {children || (
          <p className="text-gray-400 text-sm text-center mt-6">
            No candidates
          </p>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<any>(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

if (!token) {
  return <Navigate to="/login" />;
}

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
useEffect(() => {
  fetchCandidates();
}, []);
const fetchCandidates = async () => {
  const res = await fetch("http://localhost:5000/candidates", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (Array.isArray(data)) {
    setCandidates(data);
  }
};
  const moveStage = async (id: string, newStage: any) => {
    const candidate = candidates.find((c) => c._id === id);
    if (!candidate) return;

    try {
      await fetch(`http://localhost:5000/candidates/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ stage: newStage }),
});

      setCandidates((prev) =>
        prev.map((c) => (c._id === id ? { ...c, stage: newStage } : c))
      );

      const statusMap: any = {
        Applied: "applied",
        Interview: "interview",
        Offer: "offer",
      };

      await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: candidate.email,
          name: candidate.name,
          status: statusMap[newStage] || newStage.toLowerCase(),
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCandidate = async (id: string) => {
    const candidate = candidates.find((c) => c._id === id);
    if (!candidate) return;

    try {
     const res = await fetch(`http://localhost:5000/candidates/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await res.json();
console.log("DELETE RESPONSE:", data);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
      await fetchCandidates();
      await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: candidate.email,
          name: candidate.name,
          status: "rejected",
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const id = active.id as string;
    const newStage = over.id;

    moveStage(id, newStage);
  };

  const addCandidate = async () => {
    if (!name || !position || !email || !file) {
      alert("Please fill all fields + resume");
      return;
    }

    const isDuplicate = candidates.some(
      (c) => c.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (isDuplicate) {
      alert("Candidate with this email already exists!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("position", position);
    formData.append("stage", "Applied");
    formData.append("resume", file);

    try {
     const res = await fetch("http://localhost:5000/candidates", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Failed to add candidate");
        return;
      }

      const saved = await res.json();

      setCandidates((prev) => [...prev, saved]);

      // ✅ FIX: SEND EMAIL ON APPLY
      await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: saved.email,
          name: saved.name,
          status: "applied",
        }),
      });

    } catch (error) {
      console.error(error);
    }

    setName("");
    setPosition("");
    setEmail("");
    setFile(null);
  };

  const filtered = candidates.filter((c) =>
    (c.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const applied = filtered.filter((c) => c.stage === "Applied");
  const interview = filtered.filter((c) => c.stage === "Interview");
  const offer = filtered.filter((c) => c.stage === "Offer");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

       <div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-3xl font-bold text-gray-800">
      HR Hiring Pipeline
    </h1>

    <p className="text-gray-600">
      Welcome, {user.name}
    </p>

    <p className="text-gray-500 text-sm">
      Role: {user.role}
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-2 rounded"
  >
    Logout
  </button>
</div>

        <input
          className="w-full p-4 rounded-xl bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none mb-8 transition"
          placeholder="🔍 Search candidate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 mb-10 border border-gray-100">
          <input
            className="p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-400 w-full transition"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-400 w-full transition"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-400 w-full transition"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />

          <input
            type="file"
            accept="application/pdf"
            className="p-2 rounded-lg bg-gray-50 border border-gray-200 w-full"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              setFile(selected || null);
            }}
          />

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 active:scale-95 transition"
            onClick={addCandidate}
          >
            + Add
          </button>
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <Column id="Applied" title={`Applied (${applied.length})`}>
              {applied.map((c) => (
                <CandidateCard
                  key={c._id}
                  candidate={c}
                  moveStage={moveStage}
                  deleteCandidate={deleteCandidate}
                />
              ))}
            </Column>

            <Column id="Interview" title={`Interview (${interview.length})`}>
              {interview.map((c) => (
                <CandidateCard
                  key={c._id}
                  candidate={c}
                  moveStage={moveStage}
                  deleteCandidate={deleteCandidate}
                />
              ))}
            </Column>

            <Column id="Offer" title={`Offer (${offer.length})`}>
              {offer.map((c) => (
                <CandidateCard
                  key={c._id}
                  candidate={c}
                  moveStage={moveStage}
                  deleteCandidate={deleteCandidate}
                />
              ))}
            </Column>

          </div>
        </DndContext>

      </div>
    </div>
  );
}

export default Dashboard;