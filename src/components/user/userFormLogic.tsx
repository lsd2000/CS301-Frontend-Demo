import { updatePointLedgerById } from "@/api/pointLedgerApi";
import {
  UserProfile,
  createUserProfile,
  deleteUserProfile,
  updateUserProfile,
} from "@/api/userProfileApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { toast } from "sonner";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  id?: string;
  balance?: number;
  delta?: string;
}

// Optionally, you can define the type for the event handlers if you prefer
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;

export const useFormLogic = (
  initialFormData: FormData = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    id: "",
    balance: 0,
    delta: "+",
  }
) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const pageNo = Number(searchParams.get("page_no")) || 1;

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const createUserProfileMutation = useMutation({
    mutationKey: ["createUserProfile"],
    mutationFn: async (userProfile: FormData) => {
      return await createUserProfile(userProfile as UserProfile);
    },
    onError: (error) => {
      toast.error("Error creating user profile");
      console.error("error creating userprofile: ", error);
    },
    onSuccess: async (data) => {
      toast.success(data);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["userProfileWithPoints", pageNo],
        });
      }
    },
  });

  const updateUserProfileMutation = useMutation({
    mutationKey: ["updateUserProfile"],
    mutationFn: async (userProfile: FormData) => {
      return await updateUserProfile(userProfile as UserProfile);
    },
    onError: (error) => {
      toast.error("Error updating user profile");
      console.error("error updating userprofile: ", error);
    },
    onSuccess: async (data) => {
      toast.success(data);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["userProfileWithPoints", pageNo],
        });
      }
    },
  });

  const deleteUserProfileMutation = useMutation({
    mutationKey: ["deleteUserProfile"],
    mutationFn: async (userProfile: FormData) => {
      return await deleteUserProfile(userProfile?.id as string);
    },
    onError: (error) => {
      toast.error("Error deleting user profile");
      console.error("error deleting userprofile: ", error);
    },
    onSuccess: async (data) => {
      toast.success(data);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["userProfileWithPoints", pageNo],
        });
      }
    },
  });

  const updatePointLedgerByIdMutation = useMutation({
    mutationKey: ["updatePointLedgerById"],
    mutationFn: async (userProfile: FormData) => {
      return await updatePointLedgerById({
        id: userProfile.id,
        balance: userProfile.balance,
        delta: userProfile.delta,
      });
    },
    onError: (error) => {
      toast.error("Error updating user point balance");
      console.error("error updating user point balance: ", error);
    },
    onSuccess: async (data) => {
      toast.success(data);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["userProfileWithPoints", pageNo],
        });
      }
    },
  });

  const handleChange = (event: ChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (role: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      role,
    }));
  };

  const handleSelectPointAccountChange = (id: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      id,
    }));
  };
  const handleSelectDeltaChange = (delta: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      delta,
    }));
  };

  const handleSubmit = (
    event: FormEvent,
    submitType: "CREATE_USER" | "UPDATE_USER" | "DELETE_USER" | "UPDATE_POINT"
  ) => {
    event.preventDefault();
    console.log("Form data:", formData);
    // Further processing...

    switch (submitType) {
      case "CREATE_USER":
        createUserProfileMutation.mutate(formData);
        return;
      case "UPDATE_USER":
        updateUserProfileMutation.mutate(formData);
        return;
      case "DELETE_USER":
        deleteUserProfileMutation.mutate(formData);
        return;
      case "UPDATE_POINT":
        updatePointLedgerByIdMutation.mutate(formData);
        return;
      default:
        return;
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  // Add a method to setFormData directly from the component
  const updateFormData = (newFormData: FormData) => {
    setFormData(newFormData);
  };

  return {
    formData,
    handleChange,
    handleSelectChange,
    handleSelectPointAccountChange,
    handleSelectDeltaChange,
    handleSubmit,
    resetForm,
    updateFormData,
  };
};
