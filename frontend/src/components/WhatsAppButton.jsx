const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '91XXXXXXXXXX';

export default function WhatsAppButton() {
  const message = encodeURIComponent("Hi, I visited your portfolio website and I'm interested in your services.");
  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      🟢
    </a>
  );
}
