export type CustomerAccount = {
  firstName: string; lastName: string; email: string; phone: string;
  family: { id: string; first_name: string; last_name: string; date_of_birth: string | null }[];
};
