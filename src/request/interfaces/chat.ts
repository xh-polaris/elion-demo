export type Res = { message: string | null };
export type Req = {
  essay: {
    title: string;
    content: string;
  };
  input: string;
};
