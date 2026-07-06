import type { Candidate } from "../types/candidate";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  candidate: Candidate;
  moveStage: (id: string, stage: "Applied" | "Interview" | "Offer") => void;
  deleteCandidate: (id: string) => void;
};

function CandidateCard({ candidate, moveStage, deleteCandidate }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: candidate._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Avatar initials
  const initials = candidate.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Top Section */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
          {initials}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {candidate.name}
          </h2>
          <p className="text-sm text-gray-500">{candidate.email}</p>
        </div>
      </div>

      {/* Drag Handle */}
      <p
        {...listeners}
        {...attributes}
        className="text-xs text-gray-400 mb-2 cursor-grab hover:text-gray-600"
      >
        ⠿ Drag
      </p>

      {/* Resume */}
      {candidate.resume && (
        <a
          href={`http://localhost:5000/uploads/${candidate.resume}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md mb-2 hover:bg-blue-200 transition"
        >
          📄 View Resume
        </a>
      )}

      {/* Position */}
      <p className="text-gray-700 font-medium">{candidate.position}</p>

      {/* Stage Badge */}
      <span
        className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold
        ${
          candidate.stage === "Applied"
            ? "bg-blue-100 text-blue-600"
            : candidate.stage === "Interview"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {candidate.stage}
      </span>

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap mt-4">
        {candidate.stage === "Applied" && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm shadow hover:scale-105 active:scale-95 transition"
            onClick={() => moveStage(candidate._id, "Interview")}
          >
            Move → Interview
          </button>
        )}

        {candidate.stage === "Interview" && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm shadow hover:scale-105 active:scale-95 transition"
            onClick={() => moveStage(candidate._id, "Offer")}
          >
            Move → Offer
          </button>
        )}

        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow hover:scale-105 active:scale-95 transition"
          onClick={() => deleteCandidate(candidate._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CandidateCard;