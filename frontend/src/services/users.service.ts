import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import { http } from "@/utils";

const users: User[] = [
  {
    id: "1",
    firstName: "Kevin",
    lastName: "Yan",
    cin: "bj86799",
    password: "12345",
    gender: "Male",
    phone: "0654321",
    email: "KevinYan@gmail.com",
    address: "casa street 4",
  },
];

//CREATE hook (post new user to api)
export function useCreateUser() {
  return useMutation({
    mutationFn: async (user: User) => {
      //send api update request here
      const res = await http.post("/register", user);
      console.log({ res });
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
      const res = await http.get("/api/Users");
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
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(["users"], (prevUsers: any) =>
        prevUsers?.map((prevUser: User) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser
        )
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}
//DELETE hook (delete user in api)
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId: string) => {
      queryClient.setQueryData(["users"], (prevUsers: any) =>
        prevUsers?.filter((user: User) => user.id !== userId)
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
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
