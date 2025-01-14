"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

import { useCreateProject } from "@/features/projects/api/use-create-project";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Banner = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const router = useRouter();
  const mutation = useCreateProject();

  const onClick = () => {
    if (password === "Haarlem130") {
      setLoading(true);
      mutation.mutate(
        {
          name: "Gato-project",
          json: "",
          width: 1200,
          height: 900,
        },
        {
          onSuccess: ({ data }) => {
            router.push(`/editor/${data.id}`);
          },
        }
      );
    } else {
      alert("Incorrect password");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsPasswordValid(e.target.value === "Haarlem130");
  };

  return (
    <div className="text-white aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-r from-[#ff7b3e] via-[#f8af26] to-[#f5b53f]">
      <div className="rounded-full size-28 items-center justify-center bg-white/50 hidden md:flex">
        <div className="rounded-full size-20 flex items-center justify-center bg-white">
          <Sparkles className="h-20 text-[#ff7300] fill-[#ff7b00]" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl md:text-3xl font-semibold">GATO-INTERNATIONAL</h1>
        <p className="text-xs md:text-sm mb-2">
          DEVELOPING|SOURCING|BRANDING
        </p>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Admin password"
          className="mb-4 p-2 rounded-md border border-gray-300"
        />
        <Button
          disabled={mutation.isPending || !isPasswordValid}
          onClick={onClick}
          variant="secondary"
          className="w-[160px]"
        >
          Blank File
          {loading ? (
            <Loader2 className="size-4 ml-2 animate-spin" />
          ) : (
            <ArrowRight className="size-4 ml-2" />
          )}
        </Button>
      </div>
    </div>
  );
};

