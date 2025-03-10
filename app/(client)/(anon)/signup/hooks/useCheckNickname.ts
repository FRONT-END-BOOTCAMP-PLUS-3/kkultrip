import { useState } from "react";

const useCheckNickname = () => {
  const [nicknameCheckError, setNicknameCheckError] = useState<string | null>(
    null
  );
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [nicknameCheckSuccess, setNicknameCheckSuccess] = useState<
    string | null
  >(null);

  const resetNicknameCheckState = () => {
    setNicknameCheckError(null);
    setNicknameCheckSuccess(null);
    setIsNicknameAvailable(false);
  };

  const handleCheckNickname = async (nickname: string) => {
    if (!nickname) {
      setNicknameCheckError("닉네임을 입력하세요.");
      setNicknameCheckSuccess(null);
      return;
    }

    setNicknameCheckError(null);
    setNicknameCheckSuccess(null);

    try {
      const response = await fetch("/api/check-nickname", {
        method: "POST",
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();

      if (data.isAvailable) {
        setIsNicknameAvailable(true);
        setNicknameCheckSuccess("사용 가능한 닉네임입니다.");
      } else {
        setNicknameCheckError("이미 사용중인 닉네임입니다.");
        setIsNicknameAvailable(false);
      }
    } catch (error) {
      console.log("닉네임 중복 확인 중 오류 발생:", error);

      setNicknameCheckSuccess(
        error instanceof Error
          ? error.message
          : "닉네임 중복확인 중 오류가 발생했습니다."
      );

      setIsNicknameAvailable(false);
    }
  };
  return {
    isNicknameAvailable,
    nicknameCheckError,
    nicknameCheckSuccess,
    handleCheckNickname,
    resetNicknameCheckState,
  };
};

export default useCheckNickname;
