import React from "react";
import Avatar from "@material-ui/core/Avatar";

export const AvatarColumnFormatter = (cell, row) => {
  return row?.profile_pic ? (
    <Avatar
      src={row?.profile_pic}
      style={{ width: 30, height: 30 }}
      alt={row?.customer_officer}
    />
  ) : (
    <Avatar style={{ width: 30, height: 30 }}>
      {String(row?.username)[0].toLocaleUpperCase()}
    </Avatar>
  );
};
