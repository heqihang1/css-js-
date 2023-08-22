import React from "react";
import Avatar from "@material-ui/core/Avatar";

export const AvatarColumnFormatter = (cell, row) => {
  return cell ? (
    <Avatar
      src={cell}
      style={{ width: 30, height: 30 }}
      alt={row?.customer_id[0]?.customer_officer[0]?.displayname}
    />
  ) : (
    <Avatar style={{ width: 30, height: 30 }}>
      {String(row?.customer_id[0]?.customer_officer[0]?.displayname ? row?.customer_id[0]?.customer_officer[0]?.displayname : row?.customer_id[0]?.customer_officer[0]?.username
      )[0].toLocaleUpperCase()}
    </Avatar>
  );
};