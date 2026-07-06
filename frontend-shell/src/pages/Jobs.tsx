import JobCard from "../components/JobCard"
import data from "../cms-data/content.json"

function Jobs() {

  const jobs = data.jobs

  return (

    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-5">

      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

    </div>

  )
}

export default Jobs