import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LanguageSelector from "@/components/LanguageSelector";

// Mock next/navigation
const mockPush = jest.fn();
const mockPathname = "/es/chat";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}));

describe("i18n LanguageSelector", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("should detect current locale from pathname", () => {
    render(<LanguageSelector compact />);
    expect(screen.getByRole("button")).toHaveTextContent("ES");
  });

  it("should open language menu on click", () => {
    render(<LanguageSelector compact={false} />);
    const button = screen.getByRole("button", { name: /idioma/i });
    fireEvent.click(button);
    
    expect(screen.getByPlaceholderText(/buscar idioma/i)).toBeInTheDocument();
    expect(screen.getByText(/español/i)).toBeInTheDocument();
    expect(screen.getByText(/english/i)).toBeInTheDocument();
  });

  it("should filter languages by search query", () => {
    render(<LanguageSelector />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    const input = screen.getByPlaceholderText(/buscar idioma/i);
    fireEvent.change(input, { target: { value: "ing" } });
    
    expect(screen.getByText(/english/i)).toBeInTheDocument();
    expect(screen.queryByText(/español/i)).not.toBeInTheDocument();
  });

  it("should switch language and preserve route", async () => {
    render(<LanguageSelector compact />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    const englishButton = screen.getByRole("button", { name: /english \(en\)/i });
    fireEvent.click(englishButton);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/en/chat");
    });
  });

  it("should show 'Sin resultados' when no matches", () => {
    render(<LanguageSelector />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    const input = screen.getByPlaceholderText(/buscar idioma/i);
    fireEvent.change(input, { target: { value: "xyz123" } });
    
    expect(screen.getByText("Sin resultados")).toBeInTheDocument();
  });
});
