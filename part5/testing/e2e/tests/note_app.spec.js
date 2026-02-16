const { describe, test, expect, beforeEach } = require("@playwright/test");
const { loginWith, createNote } = require("./helper");

describe("Note app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "rooter",
        username: "root",
        password: "sekret",
      },
    });

    await page.goto("");
  });
  test("front page can be opened", async ({ page }) => {
    const locator = page.getByText("Notes");
    await expect(locator).toBeVisible();
    await expect(
      page.getByText(
        "Note app, Department of Computer Science, University of Helsinki 2026",
      ),
    ).toBeVisible();
  });

  test("user can log in", async ({ page }) => {
    await loginWith(page, "root", "sekret");

    await expect(page.getByText("logged in as rooter!")).toBeVisible();
  });

  test("login fails with wrong password", async ({ page }) => {
    await loginWith(page, "root", "wrong");

    const errorDiv = page.locator(".error");
    await expect(errorDiv).toContainText("wrong credentials");
    await expect(errorDiv).toHaveCSS("border-style", "solid");
    await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

    await expect(page.getByText("logged in as rooter")).not.toBeVisible();
  });

  describe("when logged in!", () => {
    beforeEach(async ({ page }) => {
      loginWith(page, "root", "sekret");
    });

    test("a new note can be created", async ({ page }) => {
      await createNote(page, "a note created by playwright");
      await expect(
        page.getByText("a note created by playwright"),
      ).toBeVisible();
    });

    describe("and several notes exist", () => {
      beforeEach(async ({ page }) => {
        await createNote(page, "first note", true);
        await createNote(page, "second note", true);
      });

      test("one note importance can be changed", async ({ page }) => {
        const otherNoteElement = page
          .getByRole("listitem")
          .filter({ hasText: "first note" });

        await otherNoteElement
          .getByRole("button", { name: "make not important" })
          .click();
        await expect(
          otherNoteElement.getByText("make important"),
        ).toBeVisible();
      });
    });
  });
});
