import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

describe("UI Primitives Unit Tests", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Field Components", () => {
    it("renders fieldset, field legend, field group, and various field elements", () => {
      render(
        <FieldSet>
          <FieldLegend variant="legend">Legend Title</FieldLegend>
          <FieldGroup>
            <Field orientation="vertical">
              <FieldLabel htmlFor="test-input">Test Label</FieldLabel>
              <FieldContent>
                <input id="test-input" />
              </FieldContent>
              <FieldDescription>Test Description</FieldDescription>
              <FieldError>Error message</FieldError>
            </Field>
            <FieldSeparator>Or</FieldSeparator>
            <Field orientation="horizontal">
              <FieldTitle>Horizontal Title</FieldTitle>
            </Field>
          </FieldGroup>
        </FieldSet>,
      );

      expect(screen.getByText("Legend Title")).toBeDefined();
      expect(screen.getByText("Test Label")).toBeDefined();
      expect(screen.getByText("Test Description")).toBeDefined();
      expect(screen.getByText("Error message")).toBeDefined();
      expect(screen.getByText("Or")).toBeDefined();
      expect(screen.getByText("Horizontal Title")).toBeDefined();
    });

    it("renders field error with array of messages and single message", () => {
      const { rerender } = render(
        <FieldError
          errors={[
            { message: "First error" },
            { message: "Second error" },
            undefined,
          ]}
        />,
      );

      expect(screen.getByText("First error")).toBeDefined();
      expect(screen.getByText("Second error")).toBeDefined();

      rerender(<FieldError errors={[{ message: "Single error" }]} />);
      expect(screen.getByText("Single error")).toBeDefined();

      rerender(<FieldError errors={[]} />);
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });

  describe("Separator Component", () => {
    it("renders horizontal and vertical separators", () => {
      render(
        <div>
          <Separator orientation="horizontal" />
          <Separator orientation="vertical" />
        </div>,
      );

      expect(document.querySelectorAll("[data-slot=separator]").length).toBe(2);
    });
  });

  describe("Card Component", () => {
    it("renders card subcomponents", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Content Area</CardContent>
          <CardFooter>Footer Area</CardFooter>
        </Card>,
      );

      expect(screen.getByText("Card Title")).toBeDefined();
      expect(screen.getByText("Card Description")).toBeDefined();
      expect(screen.getByText("Content Area")).toBeDefined();
      expect(screen.getByText("Footer Area")).toBeDefined();
    });
  });

  describe("Empty Component", () => {
    it("renders empty state primitives", () => {
      render(
        <Empty>
          <EmptyHeader>
            <EmptyMedia>Icon</EmptyMedia>
            <EmptyTitle>Nothing here</EmptyTitle>
            <EmptyDescription>Try adding some content</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>Action button</EmptyContent>
        </Empty>,
      );

      expect(screen.getByText("Icon")).toBeDefined();
      expect(screen.getByText("Nothing here")).toBeDefined();
      expect(screen.getByText("Try adding some content")).toBeDefined();
      expect(screen.getByText("Action button")).toBeDefined();
    });
  });
});
