function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 text-center">

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
        CareerHub
      </h1>

      <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">
        Smart Hiring Platform
      </p>

      <button className="mt-5 sm:mt-6 px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Browse Jobs
      </button>

    </div>
  )
}

export default Home