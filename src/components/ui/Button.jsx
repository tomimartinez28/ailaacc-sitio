import { Link } from 'react-router';

// Botón del sistema de diseño. Renderiza <Link> (to), <a> (href) o <button>.
// variant: primary | line | white | ghost | wa · size: sm
export function Button({ variant = 'primary', size, to, href, className = '', children, ...rest }) {
  const clases = ['btn', `btn-${variant}`, size && `btn-${size}`, className].filter(Boolean).join(' ');
  if (to) return <Link to={to} className={clases} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={clases} {...rest}>{children}</a>;
  return <button type="button" className={clases} {...rest}>{children}</button>;
}
