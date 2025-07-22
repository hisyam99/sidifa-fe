import { component$ } from "@qwik.dev/core";
import { AuthProcessStep } from "./AuthProcessStep";
import { AuthSecurityTip } from "./AuthSecurityTip";

interface AuthInfoContentProps {
  title: string;
  description: string;
  heroIcon: any; // Lucide icon component
  heroIconBgClass: string; // e.g., "bg-gradient-primary"
  heroTitleGradientClass: string; // e.g., "text-gradient-primary"
  processSteps: {
    icon: any;
    title: string;
    description: string;
    iconBgClass: string;
    iconColorClass: string;
  }[];
  securityTips: string[];
}

export const AuthInfoContent = component$((props: AuthInfoContentProps) => {
  const {
    title,
    description,
    heroIcon: HeroIcon,
    heroIconBgClass,
    heroTitleGradientClass,
    processSteps,
    securityTips,
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

        {/* Process */}
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-base-content mb-4">
            Cara Kerja
          </h2>

          <div class="space-y-4">
            {processSteps.map((step, index) => (
              <AuthProcessStep
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                iconBgClass={step.iconBgClass}
                iconColorClass={step.iconColorClass}
              />
            ))}
          </div>

          {/* Security Tips */}
          <div class="mt-8">
            <h3 class="font-semibold text-base-content mb-3">Tips Keamanan</h3>
            <div class="space-y-2">
              {securityTips.map((tip, index) => (
                <AuthSecurityTip key={index} tip={tip} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
