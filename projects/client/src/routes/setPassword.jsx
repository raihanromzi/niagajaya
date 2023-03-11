import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useActionData } from "react-router-dom";
import groceryImg from "../assets/Grocery.png";
import AuthLayout from "../components/AuthLayout";
import FormElem from "../components/FormElem";
import PasswordInput from "../components/PasswordInput";

/** @type {import("react-router-dom").ActionFunction} */
export const setPasswordAction = async ({ request, params }) => {
  try {
    const res = await axios.post(
      "http://localhost:8000/api/v1/auth/set-password",
      { code: params.code, ...Object.fromEntries(await request.formData()) },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

const SetPasswordPage = () => {
  const actionData = useActionData();

  return (
    <AuthLayout
      actionData={actionData}
      src={groceryImg}
      alt="kantong belanja"
      heading="Penyetelan"
    >
      <FormElem
        error={actionData?.errors?.password}
        helperText="Kata sandi mesti memiliki panjang 8 karakter atau lebih"
      >
        <PasswordInput name="password" placeholder="Kata Sandi" minLength={8} />
      </FormElem>
      <FormElem
        error={actionData?.errors?.passwordConfirm}
        helperText="Konfirmasi kata sandi mesti sama dengan kata sandi"
      >
        <PasswordInput
          name="passwordConfirm"
          placeholder="Konfirmasi Kata Sandi"
        />
      </FormElem>
      <Button type="submit" bgColor="#009262" color="#FCFCFC" w="full">
        Setel Kata Sandi
      </Button>
    </AuthLayout>
  );
};

export default SetPasswordPage;
