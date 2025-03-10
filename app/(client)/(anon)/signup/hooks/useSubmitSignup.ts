import { useRouter } from "next/navigation";
import { useState } from "react";

const useSubmitSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const submitSignup = async (
    email: string,
    nickname: string,
    password: string
  ) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          nickname,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입 실패");
      }

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      router.push("/login");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { submitSignup, isLoading, submitError };
};

export default useSubmitSignup;
