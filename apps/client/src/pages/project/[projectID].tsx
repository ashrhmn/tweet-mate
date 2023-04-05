import { useRouter } from "next/router";

export default function ProjectDetails() {
  const router = useRouter();
  const projectID = router.query.projectID;
  return <div>{projectID}</div>;
}
