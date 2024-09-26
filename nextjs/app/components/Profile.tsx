import Image from "next/image";
import { type SessionData } from "../auth";
import UpdateEmail from "./UpdateEmail";
type Props = {
  user: SessionData;
};

export function Profile({ user }: Props) {
  return (
    <div className="flex gap-4">
      <Image
        width={100}
        height={100}
        className="w-[100px] h-[100px]"
        src={user.picture ?? "/pfp.jpg"}
        alt="Profile picture"
      />
      <div>
        <span>
          Hello <span className="font-bold">{user.name}</span>!
        </span>
        <UpdateEmail email={user.email} />
      </div>
    </div>
  );
}
