import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { http } from "@/utils";

//CREATE hook (post new user to api)
export function useCreateUser() {
  return useMutation({
    mutationFn: async (user: User) => {
      //send api update request here
      const res = await http.post("/register", user);
      return res.data;
    },
  });
}
//READ hook (get users from api)
export function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      //send api request here
      const res = await http.get("/api/users");
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
}
//UPDATE hook (put user in api)
export function useUpdateUser() {
  return useMutation({
    mutationFn: async (user: User) => {
      //send api update request here
      const res = await http.put(`/api/users`, user);
      return res.data;
    },
  });
}
//DELETE hook (delete user in api)
export function useDeleteUser() {
  return useMutation({
    mutationFn: async (userId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
  });
}

export const validateRequired = (value: string) => !!value.length;
export const validateEmail = (Email: string) =>
  !!Email.length &&
  Email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
export function validateUser(user: User) {
  return {
    FirstName: !validateRequired(user.firstName)
      ? "First Name is Required"
      : "",
    LastName: !validateRequired(user.lastName) ? "Last Name is Required" : "",
    Email: !validateEmail(user.email) ? "Incorrect Email Format" : "",
  };
}
