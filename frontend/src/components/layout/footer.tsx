"use client"

interface FooterProps {
  title?: string;
  tagline?: string;
  copyright?: string;
}

const Footer = ({
  tagline = "Simplificando tus juegos de rol de mesa favoritos",
  title = "Arcana Codex",
  copyright = "© 2025 Copyright. All rights reserved.",
}: FooterProps) => {
  return (
    <section>
      <div>
        <footer>
          <div className="flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <div className="pd-3em">{copyright}</div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
  