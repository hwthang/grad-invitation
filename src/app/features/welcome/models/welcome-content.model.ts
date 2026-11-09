export interface WelcomeContent {
  hero: {
    heading: string;
    subtitle: string;
  };

  form: {
    label: string;
    placeholder: string;
    submitButton: string;
    supportingText: string;
  };

  validation: {
    required: string;
  };

  decoration: {
    enabled: boolean;
    showGraduationIcon: boolean;
  };
}
