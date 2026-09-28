import type { Metadata } from "next";

import KineticBrandFilm from "@/components/brand-film/kinetic-brand-film";

export const metadata: Metadata = {
  title: "Brand Film",
  description:
    "A 30-second kinetic editorial portfolio film for Christian Bonafena.",
};

export default function BrandFilmPage() {
  return <KineticBrandFilm />;
}
