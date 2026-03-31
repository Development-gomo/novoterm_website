import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Map language codes to form IDs (update as needed)
const FORM_IDS = {
  en: 320, // English form ID
  sv: 321, // Swedish form ID
};

export default function CF7ContactForm({ formId: propFormId }) {
  const router = useRouter();
  const lang = router.locale || "sv";
  const [fields, setFields] = useState([]); // [{name, label, type, ...}]
  const [formId, setFormId] = useState(propFormId || FORM_IDS[lang] || FORM_IDS.sv);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Update formId on language change
  useEffect(() => {
    setFormId(propFormId || FORM_IDS[lang] || FORM_IDS.sv);
  }, [lang]);

  // Optionally fetch form structure if your API supports it
  // useEffect(() => {
  //   async function fetchFields() {
  //     const res = await fetch(`https://gomostaging.com/novoterm-headless//wp-json/custom-cf7/v1/forms/${formId}`);
  //     const data = await res.json();
  //     setFields(data.fields || []);
  //   }
  //   fetchFields();
  // }, [formId]);

  // For demo, hardcode fields (update as needed)
  useEffect(() => {
    setFields([
      { name: "your-name", label: lang === "sv" ? "Namn" : "Name", type: "text" },
      { name: "your-email", label: lang === "sv" ? "E-post" : "Email", type: "email" },
      { name: "your-message", label: lang === "sv" ? "Meddelande" : "Message", type: "textarea" },
    ]);
  }, [lang]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`https://gomostaging.com/novoterm-headless//wp-json/custom-cf7/v1/forms/${formId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === "mail_sent") {
        setResult(lang === "sv" ? "Tack för ditt meddelande!" : "Thank you for your message!");
        setFormData({});
      } else {
        setError(data.message || (lang === "sv" ? "Något gick fel." : "Something went wrong."));
      }
    } catch (err) {
      setError(lang === "sv" ? "Nätverksfel." : "Network error.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block mb-1 font-semibold" htmlFor={field.name}>{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? (lang === "sv" ? "Skickar..." : "Sending...") : (lang === "sv" ? "Skicka" : "Send")}
      </button>
      {result && <div className="text-green-600 mt-2">{result}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}
