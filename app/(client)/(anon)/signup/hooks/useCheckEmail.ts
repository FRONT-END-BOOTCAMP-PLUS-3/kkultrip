import { useState } from "react";

const useCheckEmail = () => {
  const [emailCheckError, setEmailCheckError] = useState<string | null>(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [emailCheckSuccess, setEmailCheckSuccess] = useState<string | null>(
    null
  );

  const resetEmailCheckState = () => {
    setEmailCheckError(null);
    setEmailCheckSuccess(null);
    setIsEmailAvailable(false);
  };

  const handleCheckEmail = async (email: string) => {
    if (!email) {
      setEmailCheckError(null);
      setEmailCheckSuccess(null);
      return;
    }

    setEmailCheckError(null);
    setEmailCheckSuccess(null);

    try {
      const response = await fetch("/api/check-email", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.isAvailable) {
        setIsEmailAvailable(true);
        setEmailCheckSuccess("사용 가능한 이메일입니다.");
        setEmailCheckError(null);
      } else {
        setEmailCheckError("이미 사용중인 이메일입니다.");
        setEmailCheckSuccess(null);
        setIsEmailAvailable(false);
      }
    } catch (error) {
      setEmailCheckError(
        error instanceof Error ? error.message : "이메일 확인 중 오류 발생"
      );
      setIsEmailAvailable(false);
    }
  };

  return {
    isEmailAvailable,
    emailCheckError,
    emailCheckSuccess,
    handleCheckEmail,
    resetEmailCheckState,
  };
};

export default useCheckEmail;
