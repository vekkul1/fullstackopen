import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  test("test createBlog called 1 time", async () => {
    const createBlog = vi.fn();
    render(<BlogForm createBlog={createBlog} />);

    const user = userEvent.setup();
    const createButton = screen.getByText("create");
    await user.click(createButton);

    expect(createBlog.mock.calls).toHaveLength(1);
  });
  test("test createBlog called with right inforamtion", async () => {
    const createBlog = vi.fn();
    render(<BlogForm createBlog={createBlog} />);

    const blog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    };

    const user = userEvent.setup();
    const titleField = screen.getByLabelText("title:");
    const authorField = screen.getByLabelText("author:");
    const urlField = screen.getByLabelText("url:");
    const createButton = screen.getByText("create");

    await user.type(titleField, blog.title);
    await user.type(authorField, blog.author);
    await user.type(urlField, blog.url);
    await user.click(createButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    assert.deepEqual(createBlog.mock.calls[0][0], blog);
  });
});
