import type { Job } from "../types/job"
interface Props {
  job: Job
}

function JobCard({ job }: Props) {

  return (

    <div className="border p-5 rounded shadow">

      <h2 className="text-xl font-bold">{job.title}</h2>

      <p className="text-gray-600">{job.company}</p>

      <p>{job.location}</p>

      <span className="text-sm text-blue-600">{job.type}</span>

    </div>

  )
}

export default JobCard