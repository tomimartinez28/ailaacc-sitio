// Encabezado centrado de sección: etiqueta tipo píldora + título + bajada opcional
export function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHead({ eyebrow, title, lede }) {
  return (
    <div className="sec-head">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2>{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}
