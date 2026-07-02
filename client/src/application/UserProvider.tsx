"use client";
import { useEffect } from "react";
import ApplicationLayout from "./ApplicationLayout";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { refreshTokenThunk } from "@/entities/user/api/UserApiThunk";

type Props = {
  children: React.ReactNode;
};

export default function UserProvider({ children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshTokenThunk());
  }, [dispatch]);

  return <ApplicationLayout>{children}</ApplicationLayout>;
}
