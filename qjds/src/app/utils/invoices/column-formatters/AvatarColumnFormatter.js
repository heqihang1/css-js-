import React from "react";
import Avatar from "@material-ui/core/Avatar";

export const AvatarColumnFormatter = (cell, row) => {
  const avatarData = cell;
  return avatarData?.profile_pic ? (
    <Avatar
      src={avatarData?.profile_pic}
      style={{ width: 30, height: 30 }}
      alt={
        avatarData?.displayname ? avatarData?.displayname : avatarData?.username
      }
    />
  ) : (
    <Avatar style={{ width: 30, height: 30 }}>
      {String(
        avatarData?.displayname ? avatarData?.displayname : avatarData?.username
      )[0].toLocaleUpperCase()}
    </Avatar>
  );
};
