"use client"

interface FooterProps {
  title?: string;
  tagline?: string;
  copyright?: string;
}

const Footer = ({
  tagline = "Simplificando tus juegos de rol de mesa favoritos",
  title = "Digital Twenty",
  copyright = "© 2025 Copyright. All rights reserved.",
}: FooterProps) => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          {/*<div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <p className="text-xl font-semibold">{title}</p>
              </div>
              <p className="mt-4 font-bold">{tagline}</p>
            </div>
            <div>
                ### Redes sociales
            </div>
          </div>*/}
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <div>{copyright}</div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
  