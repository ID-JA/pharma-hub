import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import { http } from "@/utils";

//CREATE hook (post new user to api)
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: User) => {
      //send api update request here
      const res = await http.post("/register", user);
      return res.data;
    },
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(
        ["users"],
        (prevUsers: any) =>
          [
            ...prevUsers,
            {
              ...newUserInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as User[]
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      //send api update request here
      const res = await http.put(`/api/users`, user);
      return res.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
//DELETE hook (delete user in api)
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      //send api update request here
      const res = await http.delete(`/api/users/${userId}`);
      return res.data;
    },
    //client side optimistic update
    onMutate: (userId: string) => {
      queryClient.setQueryData(["users"], (prevUsers: any) =>
        prevUsers?.filter((user: User) => user.id !== userId)
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
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
