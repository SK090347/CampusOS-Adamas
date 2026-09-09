import { AuraChat } from "./AuraChat";

export default function AuraPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">AURA Assistant</h1>
        <p className="page-sub">
          Answers only from CampusOS structured data. If something cannot be verified, AURA says so — no hallucinated facts.
        </p>
      </div>
      <AuraChat />
    </div>
  );
}
