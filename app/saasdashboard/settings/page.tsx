"use client";

import { Tabs, Tab } from "@nextui-org/tabs";
import { Input } from "@nextui-org/input";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import { Avatar } from "@nextui-org/avatar";
import { UserIcon, BellIcon, LockIcon } from "lucide-react";
import React from "react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-default-500">Manage your account preferences and settings.</p>
      </div>

      <Tabs aria-label="Settings tabs" color="primary" variant="underlined">
        <Tab
          key="profile"
          title={
            <div className="text-white flex items-center space-x-2">
              <UserIcon size={18} />
              <span>Profile</span>
            </div>
          }
        >
          <Card className="mt-4 border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-lg shadow-sm">
            <CardBody className="gap-6 p-6">
              <div className="flex items-center gap-6">
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-20 h-20 text-large" />
                <Button color="primary" variant="flat" size="sm">Change Avatar</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" defaultValue="Tony" labelPlacement="outside" />
                <Input label="Last Name" defaultValue="Reichert" labelPlacement="outside" />
                <Input label="Email" defaultValue="tony.reichert@example.com" labelPlacement="outside" className="md:col-span-2" />
                <div className="md:col-span-2">
                  <label className="text-small mb-1 block">Bio</label>
                  <textarea className="w-full p-2 rounded-xl bg-default-100 text-small outline-none focus:ring-2 ring-primary transition-all min-h-[100px]" defaultValue="Product Designer based in San Francisco." />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <Button color="primary">Save Changes</Button>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="notifications"
          title={
            <div className="text-white flex items-center space-x-2">
              <BellIcon size={18} />
              <span>Notifications</span>
            </div>
          }
        >
          <Card className="mt-4 border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-lg shadow-sm">
            <CardBody className="gap-6 p-6">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Email Notifications</h3>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Marketing emails</span>
                    <span className="text-xs text-default-500">Receive emails about new products, features, and more.</span>
                  </div>
                  <Switch defaultSelected color="primary" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Social emails</span>
                    <span className="text-xs text-default-500">Receive emails for friend requests, follows, and more.</span>
                  </div>
                  <Switch defaultSelected color="primary" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Security emails</span>
                    <span className="text-xs text-default-500">Receive emails about your account security.</span>
                  </div>
                  <Switch defaultSelected isDisabled color="success" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="security"
          title={
            <div className="text-white flex items-center space-x-2">
              <LockIcon size={18} />
              <span>Security</span>
            </div>
          }
        >
          <Card className="mt-4 border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-lg shadow-sm">
            <CardBody className="gap-6 p-6">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Password</h3>
                <Input label="Current Password" type="password" variant="bordered" labelPlacement="outside" />
                <Input label="New Password" type="password" variant="bordered" labelPlacement="outside" />
                <Input label="Confirm New Password" type="password" variant="bordered" labelPlacement="outside" />

                <div className="flex justify-end mt-2">
                  <Button color="primary">Update Password</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
