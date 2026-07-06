export type Candidate = {
  _id: string
  name: string
  email: string
  position: string
  stage: "Applied" | "Interview" | "Offer"
  resume?: string
}