import { ExampleSendMail } from "./exampleEmail";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center mx-auto">
      CIIS XXVI
      <ExampleSendMail />
    </div>
  );
}
