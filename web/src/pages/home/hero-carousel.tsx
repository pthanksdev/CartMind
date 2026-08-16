import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PUBLIC_ROUTES } from "@/routes/route";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHeroBannersQueryFn } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback images if database image URL is external/placeholder
import carouselImageOne from "@/assets/images/carousel-img-1.png";
import carouselImageTwo from "@/assets/images/carousel-img-2.png";
import carouselImageThree from "@/assets/images/carosuel-img-3.png";

const fallbackImages = [carouselImageTwo, carouselImageThree, carouselImageOne];

const HeroCarousel = () => {
  // Fetch dynamic hero slides from backend PostgreSQL database
  const { data, isLoading } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: getHeroBannersQueryFn,
  });

  const slides = data?.banners ?? [];

  if (isLoading) {
    return (
      <section className="w-full py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[260px] w-full rounded-xl" />
          <Skeleton className="h-[260px] w-full rounded-xl hidden lg:block" />
        </div>
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section className="w-full py-5">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3500,
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {slides.map((slide: any, idx: number) => {
            const bgImage = slide.imageUrl && !slide.imageUrl.includes("unsplash")
              ? slide.imageUrl
              : fallbackImages[idx % fallbackImages.length];

            return (
              <CarouselItem
                key={slide.id || idx}
                className="basis-full pl-4 lg:basis-1/2"
              >
                <article className="relative h-[250px] overflow-hidden shadow-xs rounded-xl border border-border bg-card md:h-[260px]">
                  <img
                    src={bgImage}
                    alt={slide.title || "Hero banner"}
                    className="absolute inset-0 size-full object-cover"
                  />

                  <div className="relative z-10 flex h-full sm:max-w-[55%] flex-col justify-center gap-4 p-7 md:p-9 bg-gradient-to-r from-white/90 via-white/80 to-transparent dark:from-slate-950/90 dark:via-slate-950/80">
                    {slide.subtitle && (
                      <p className="text-xs md:text-sm font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                        {slide.subtitle}
                      </p>
                    )}
                    <h1 className="text-xl md:text-2xl font-extrabold leading-tight text-foreground">
                      {slide.title}
                    </h1>
                    <Button
                      asChild
                      variant="secondary"
                      className="h-10 w-fit rounded-full px-7 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
                    >
                      <Link to={slide.actionUrl || PUBLIC_ROUTES.PRODUCTS}>
                        {slide.action || "Shop now"}
                      </Link>
                    </Button>
                  </div>
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
