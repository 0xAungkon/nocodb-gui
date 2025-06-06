export enum FormBuilderInputType {
  Input = 'input',
  Select = 'select',
  Switch = 'switch',
  Space = 'space',
  Password = 'password',
  SelectIntegration = 'integration',
  SelectBase = 'select-base',
  OAuth = 'oauth',
}

export interface FormBuilderCondition {
  // model path to check for condition
  model: string;
  // value to check for condition
  value?: string;
  // check if the value is equal to the model value
  equal?: string;
  // check if the value is in the array
  in?: string[];
  // check if the value is empty
  empty?: boolean;
  // check if the value is not empty
  notEmpty?: boolean;
}

export enum FormBuilderValidatorType {
  Required = 'required',
}

export interface FormBuilderElement {
  // element type
  type: FormBuilderInputType;
  // property path in the form JSON
  model?: string;
  // default value
  defaultValue?: string[] | string | boolean | number | null;
  // label for the element
  label?: string;
  // placeholder for the element (if applicable)
  placeholder?: string;
  // percentage width of the element
  width?: number;
  // category of the element - same category elements are grouped together
  category?: string;
  // help text for the element
  // options for select element
  options?: { value: string; label: string }[];
  // select mode for the element (if applicable) - default is single
  selectMode?: 'single' | 'multiple' | 'multipleWithInput';
  // integration type filter for integration element
  integrationFilter?: {
    type?: string;
    sub_type?: string;
  };
  // oauth meta
  oauthMeta?: {
    // oauth provider
    provider: string;
    // oauth auth uri
    authUri: string;
    // oauth redirect uri
    redirectUri: string;
    // client id
    clientId: string;
    // code key (code by default)
    codeKey?: string;
    // oauth scopes
    scopes?: string[];
  };
  // condition for the element to be visible
  condition?: FormBuilderCondition | FormBuilderCondition[];
  // border for the element (if applicable) - default is false
  border?: boolean;
  // show hint as tooltip for the element (if applicable) - default is false
  showHintAsTooltip?: boolean;
  // validators for the element
  validators?: { type: FormBuilderValidatorType; message?: string }[];
  // fetch options for the element using key
  fetchOptionsKey?: string;
}

export type FormDefinition = FormBuilderElement[];

export const FORM_BUILDER_NON_CATEGORIZED = 'form-builder-non-categorized';
