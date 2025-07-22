import { component$ } from "@builder.io/qwik";

interface ProfileBenefitListProps {
  benefits: { text: string; icon: any }[];
}

export const ProfileBenefitList = component$(
  (props: ProfileBenefitListProps) => {
    const { benefits } = props;
    return (
      <div class="mt-6">
        <h3 class="font-semibold text-base-content mb-3">Manfaat Akun Anda</h3>
        <div class="space-y-2">
          {benefits.map((benefit, index) => (
            <div key={index} class="flex items-center gap-3 text-sm">
              {benefit.icon && <benefit.icon class="w-4 h-4 text-success" />}
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
