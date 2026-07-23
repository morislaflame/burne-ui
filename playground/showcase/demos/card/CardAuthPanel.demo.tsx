import { useCallback, useState } from "react";

import { Form, type FormValues } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Checkbox } from "@/components/core/Checkbox";
import { Input } from "@/components/core/Input";
import { Link } from "@/components/core/Link";
import { Tabs } from "@/components/core/Tabs";

export function CardAuthPanelDemo() {
  const [tab, setTab] = useState("login");

  const onSubmit = useCallback((values: FormValues) => {
    void values;
  }, []);

  return (
    <Card variant="secondary" className="w-full max-w-sm">
      <Card.Header>
        <Card.Title>Account</Card.Title>
        <Card.Description>Login or create a new profile</Card.Description>
      </Card.Header>
      <Card.Body>
        <Tabs value={tab} onValueChange={setTab}>
          <Tabs.List className="w-full">
            <Tabs.Tab value="login" className="flex-1">
              Entrance
            </Tabs.Tab>
            <Tabs.Tab value="register" className="flex-1">
              Registration
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login" className="">
            <Form onSubmit={onSubmit} aria-label="Login" className="gap-xlarge">
              <Form.Section>
                <Input required label="Email" name="login-email" autoComplete="email" placeholder="you@example.com" />
                <Input
                  required
                  label="Password"
                  name="login-password"
                  inputType="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <div className="flex">
                  <Link href="#" size="small" className="text-muted">
                    Forgot your password?
                  </Link>
                </div>
              </Form.Section>
              <Button type="submit" variant="primary" className="w-full">
                Login
              </Button>
            </Form>
          </Tabs.Panel>

          <Tabs.Panel value="register">
            <Form onSubmit={onSubmit} aria-label="Registration" className="gap-xlarge">
              <Form.Section>
                <Input required label="Name" name="register-name" autoComplete="name" placeholder="Ivan"/>
                <Input required label="Email" name="register-email" autoComplete="email" placeholder="you@example.com" />
                <Input
                  required
                  label="Password"
                  name="register-password"
                  inputType="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </Form.Section>
              <Form.Section>
                <Checkbox
                  required
                  name="terms"
                  value="accepted"
                  label="I accept the terms of use"
                />
              </Form.Section>
              <Button type="submit" variant="primary" className="w-full">
                Create an account
              </Button>
            </Form>
          </Tabs.Panel>
        </Tabs>
      </Card.Body>
      <Card.Footer className="justify-center border-t border-token flex flex-col gap-xsmall">
        <Link href="#" size="small" className="text-muted">
          Privacy Policy
        </Link>
      </Card.Footer>
    </Card>
  );
}
