import { component$ } from "@builder.io/qwik";
import { AuthBenefitItem } from "./AuthBenefitItem";
import { AuthRequirementsList } from "./AuthRequirementsList";

interface SignupHeroContentProps {
  title: string;
  description: string;
  heroIcon: any; // Lucide icon component
  heroIconBgClass: string; // e.g., "bg-gradient-primary"
  heroTitleGradientClass: string; // e.g., "text-gradient-primary"
  benefits: {
    icon: any;
    title: string;
    description: string;
    iconBgClass: string;
    iconColorClass: string;
  }[];
  requirements: string[];
}

export const SignupHeroContent = component$((props: SignupHeroContentProps) => {
  const {
    title,
    description,
    heroIcon: HeroIcon,
    heroIconBgClass,
    heroTitleGradientClass,
    benefits,
    requirements,
  } = props;

  return (
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 lg:p-12 xl:p-16">
      <div class="flex flex-col justify-center w-full max-w-lg mx-auto">
        <div class="text-center lg:text-left mb-8">
          <div
            class={`${heroIconBgClass} rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl`}
          >
            <HeroIcon class="w-10 h-10" />
          </div>
          <h1
            class={`text-3xl lg:text-4xl xl:text-5xl font-bold ${heroTitleGradientClass} mb-4`}
          >
            {title}
          </h1>
          <p class="text-lg text-base-content/70 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Benefits */}
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-base-content mb-4">
            Manfaat Bergabung
          </h2>

          <div class="space-y-4">
            {benefits.map((benefit, index) => (
              <AuthBenefitItem
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                iconBgClass={benefit.iconBgClass}
                iconColorClass={benefit.iconColorClass}
              />
            ))}
          </div>

          {/* Requirements */}
          <AuthRequirementsList requirements={requirements} />
        </div>
      </div>
    </div>
  );
});
