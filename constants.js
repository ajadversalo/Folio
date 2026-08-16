(() => {
const book = {
  topic: "Object-Oriented Programming",
  chapters: [{ number: "01", title: "SOLID", pages: [
    { kicker: "Chapter one / SOLID", title: "Dependency Inversion", lead: "The main design principle that handles dependency injection is the Dependency Inversion Principle (DIP)—the “D” in the SOLID principles of Object-Oriented Design.", content: `<p>While <strong>Dependency Inversion</strong> is the principle, <strong>Dependency Injection (DI)</strong> is the concrete technique—or design pattern—used to implement it.</p><div class="chapter-card"><span>01</span><div><small>Principle</small><strong>Dependency Inversion Principle (DIP)</strong></div></div>` },
    { kicker: "Dependency Inversion / The rules", title: "Depend on abstractions.", lead: "DIP states two main rules:", content: `<ol class="principle-list"><li><span>01</span><p>High-level modules should not depend on low-level modules. Both should depend on abstractions, such as interfaces or abstract classes.</p></li><li><span>02</span><p>Abstractions should not depend on details. Details—concrete implementations—should depend on abstractions.</p></li></ol>` },
    { kicker: "Dependency Inversion / Core idea", title: "Stop creating dependencies inside the class.", lead: "Decouple the high-level class from the concrete service.", content: `<p>Instead of a class creating its own dependencies directly—for example, calling <code>new EmailService()</code>—you supply that dependency from outside.</p><p>Both the high-level class and the service agree on an interface contract, such as <code>IMessageService</code>.</p><div class="flow"><span>High-level class</span><b>→</b><span>Interface contract</span><b>←</b><span>Concrete service</span></div>` },
    { kicker: "Dependency Inversion / Vocabulary", title: "Principle, pattern, and container.", lead: "Three closely related concepts often get grouped together.", content: `<div class="table-wrap"><table><thead><tr><th>Term</th><th>What it is</th><th>Purpose</th></tr></thead><tbody><tr><td><strong>Dependency Inversion Principle</strong><small>DIP</small></td><td>Design principle</td><td>Depend on abstractions, not concrete implementations.</td></tr><tr><td><strong>Dependency Injection</strong><small>DI</small></td><td>Design pattern / technique</td><td>Pass a dependency into an object rather than having the object instantiate it.</td></tr><tr><td><strong>IoC Container</strong></td><td>Framework / tool</td><td>Automate creating and injecting dependencies throughout an application—for example, Autofac, Spring, or NestJS.</td></tr></tbody></table></div>` },
    { kicker: "Dependency Inversion / Connections", title: "Associated principles and patterns.", lead: "Dependency injection supports a wider family of design ideas.", content: `<div class="concept-list"><section><span>IoC</span><div><h3>Inversion of Control</h3><p>A broader architectural principle where control of objects or a portion of a program is transferred to a container or framework. Dependency Injection is a specific form of IoC.</p></div></section><section><span>SRP</span><div><h3>Single Responsibility Principle</h3><p>By taking the task of instantiating dependencies out of a class, the class focuses solely on its primary behavior rather than object creation.</p></div></section><section><span>OCP</span><div><h3>Open/Closed Principle</h3><p>Injecting abstractions makes it easy to introduce new implementations without changing the consuming class’s source code.</p></div></section></div>` },
    { kicker: "Dependency Inversion / In practice", title: "From tightly coupled to loosely coupled.", lead: "Compare direct construction with constructor injection.", content: `<div class="code-section"><div class="code-label bad"><span>×</span><div><strong>Without DIP / DI</strong><small>Tightly coupled</small></div></div><p>The <code>OrderProcessor</code> directly instantiates its dependency. It cannot be easily tested or swapped for a different implementation.</p><pre><span class="language">C#</span><code>public class OrderProcessor
{
    private SqlDatabase _database;

    public OrderProcessor()
    {
        // Direct coupling to a concrete implementation
        _database = new SqlDatabase();
    }
}</code></pre></div><div class="code-section"><div class="code-label good"><span>✓</span><div><strong>With DIP / DI</strong><small>Loosely coupled</small></div></div><p>The dependency is inverted and injected through the constructor via an interface.</p><pre><span class="language">C#</span><code>public interface IDatabase
{
    void SaveOrder(Order order);
}

public class OrderProcessor
{
    private readonly IDatabase _database;

    // Dependency is injected from the outside
    public OrderProcessor(IDatabase database)
    {
        _database = database;
    }
}</code></pre></div>` }
  ]}]
};

const originalPages = book.chapters[0].pages;
const subsection = page => `<section class="subsection"><h3>${page.title}</h3><p class="section-lead">${page.lead}</p>${page.content}</section>`;
const srpPages = [
  {
    kicker: "Chapter one / SOLID / S",
    title: "Single Responsibility Principle",
    lead: "The S in SOLID stands for the Single Responsibility Principle (SRP).",
    content: `<p>Coined by Robert C. Martin (“Uncle Bob”), the principle states:</p><blockquote>“A class should have one, and only one, reason to change.”</blockquote><p>This doesn't mean a class can only have one method or perform one line of code. Instead, “reason to change” refers to actors or stakeholders. A class should only be responsible to a single user group, business role, or subsystem.</p><section class="subsection"><h3>Why SRP Matters</h3><p>When a class takes on multiple responsibilities, those responsibilities become coupled. Changing code to satisfy one requirement—for example, updating database queries—can accidentally break unrelated logic—for example, PDF generation.</p><div class="benefit-grid"><article><strong>Maintainability</strong><p>Smaller, focused classes are easier to read and navigate.</p></article><article><strong>Testability</strong><p>Fewer dependencies mean fewer mocks and straightforward unit tests.</p></article><article><strong>Merge Conflicts</strong><p>Fewer developers editing the exact same file for different features.</p></article></div></section>`
  },
  {
    kicker: "Single Responsibility / Violation",
    title: "The “Do-It-All” Class",
    lead: "Consider a class handling an employee record.",
    content: `<div class="code-label bad"><span>×</span><div><strong>Violation Example</strong><small>Three responsibilities, one class</small></div></div><pre><span class="language">C#</span><code>public class Employee
{
    public string Name { get; set; }
    public decimal HourlyRate { get; set; }

    // Responsibility 1: Business Logic / Payroll
    public decimal CalculatePay(int hoursWorked)
    {
        return HourlyRate * hoursWorked;
    }

    // Responsibility 2: Database Operations / Persistence
    public void SaveToDatabase()
    {
        Console.WriteLine($"Saving {Name} to database...");
        // SQL queries, connection logic, etc.
    }

    // Responsibility 3: Reporting / Presentation
    public void ExportPayrollReportPdf()
    {
        Console.WriteLine($"Generating PDF report for {Name}...");
        // PDF formatting, layout logic, etc.
    }
}</code></pre><section class="subsection"><h3>Why this breaks SRP</h3><p>This class has three distinct reasons to change:</p><ol class="principle-list"><li><span>01</span><p>The HR / Accounting Department changes how overtime pay is calculated (<code>CalculatePay</code>).</p></li><li><span>02</span><p>The Database Admin / IT Team migrates from SQL to PostgreSQL (<code>SaveToDatabase</code>).</p></li><li><span>03</span><p>The Design / Operations Team changes the layout of the payroll PDF (<code>ExportPayrollReportPdf</code>).</p></li></ol></section>`
  },
  {
    kicker: "Single Responsibility / Refactoring",
    title: "One concern per class.",
    lead: "To apply SRP, break the responsibilities into distinct classes, each owning a single concern.",
    content: `<div class="code-section"><div class="code-label good"><span>1</span><div><strong>The Domain Entity</strong><small>Core business properties</small></div></div><p>Contains only core business properties and logic related to an employee:</p><pre><span class="language">C#</span><code>public class Employee
{
    public string Id { get; set; }
    public string Name { get; set; }
    public decimal HourlyRate { get; set; }
}</code></pre></div><div class="code-section"><div class="code-label good"><span>2</span><div><strong>Business Logic / Payroll Calculation</strong><small>Calculation rules</small></div></div><p>Owns calculation rules:</p><pre><span class="language">C#</span><code>public class PayrollCalculator
{
    public decimal CalculatePay(Employee employee, int hoursWorked)
    {
        // Payroll rules live here alone
        return employee.HourlyRate * hoursWorked;
    }
}</code></pre></div><div class="code-section"><div class="code-label good"><span>3</span><div><strong>Persistence / Data Access</strong><small>Saving and fetching data</small></div></div><p>Owns saving and fetching employee data:</p><pre><span class="language">C#</span><code>public class EmployeeRepository
{
    public void Save(Employee employee)
    {
        // Persistence logic lives here alone
        Console.WriteLine($"Saving {employee.Name} to storage...");
    }
}</code></pre></div><div class="code-section"><div class="code-label good"><span>4</span><div><strong>Reporting / Presentation</strong><small>Report formatting</small></div></div><p>Owns report formatting:</p><pre><span class="language">C#</span><code>public class PayrollReportGenerator
{
    public void ExportPdf(Employee employee, decimal pay)
    {
        // PDF layout and rendering logic lives here alone
        Console.WriteLine($"Generating PDF for {employee.Name} with pay: \${pay}");
    }
}</code></pre></div>`
  },
  {
    kicker: "Single Responsibility / Review",
    title: "How to spot SRP violations.",
    lead: "Look out for these common code smells.",
    content: `<div class="table-wrap"><table><thead><tr><th>Code smell</th><th>What it suggests</th></tr></thead><tbody><tr><td><strong>“God Classes”</strong></td><td>Classes with thousands of lines or dozens of injected dependencies.</td></tr><tr><td><strong>Mixed Concerns</strong></td><td>Business logic interleaved with UI formatting, file I/O, or SQL calls.</td></tr><tr><td><strong>Frequent Merge Conflicts</strong></td><td>Multiple developers editing the same class file for completely different tickets.</td></tr><tr><td><strong>Hard-to-Name Classes</strong></td><td>Class names containing words like <code>Manager</code>, <code>Processor</code>, or <code>CommonUtils</code> often act as dumping grounds.</td></tr></tbody></table></div><section class="takeaway"><span>Key takeaway</span><p>SRP isn't about making classes as tiny as possible; it's about cohesion. Group things together that change for the same reason, and separate things that change for different reasons.</p></section>`
  }
];
const dipPages = [
  { ...originalPages[0], title: "Dependency Inversion Principle", content: `${originalPages[0].content}${subsection(originalPages[1])}${subsection(originalPages[2])}` },
  { ...originalPages[3], title: "DIP, DI, and IoC", content: `${originalPages[3].content}${subsection(originalPages[4])}` },
  originalPages[5]
];
dipPages[0].kicker = "Chapter five / SOLID / D";

const ocpPages = [
  {
    kicker: "Chapter two / SOLID / O",
    title: "Open / Closed Principle",
    lead: "The O in SOLID stands for the Open/Closed Principle (OCP).",
    content: `<p>Coined by Bertrand Meyer in 1988, the principle states:</p><blockquote>“Software entities (classes, modules, functions) should be open for extension, but closed for modification.”</blockquote><section class="subsection"><h3>What Does That Mean?</h3><div class="definition-pair"><article><span>Open</span><div><strong>Open for extension</strong><p>You should be able to add new functionality or change behavior when requirements change.</p></div></article><article><span>Closed</span><div><strong>Closed for modification</strong><p>You should be able to extend that behavior without editing existing, tested source code.</p></div></article></div><p>The goal is to avoid cascading bugs. Every time you open a working class and edit its code, you risk introducing bugs into existing features. OCP allows you to add new features by adding new code rather than modifying old code.</p></section>`
  },
  {
    kicker: "Open / Closed / Violation",
    title: "Conditional logic that keeps growing.",
    lead: "Imagine a discount processing engine for an e-commerce platform.",
    content: `<div class="code-label bad"><span>×</span><div><strong>Violation Example</strong><small>if / switch statements</small></div></div><pre><span class="language">C#</span><code>public enum CustomerType
{
    Regular,
    Premium,
    VIP
}

public class DiscountCalculator
{
    public decimal CalculateDiscount(decimal amount, CustomerType type)
    {
        if (type == CustomerType.Regular)
        {
            return amount * 0.05m; // 5% discount
        }
        else if (type == CustomerType.Premium)
        {
            return amount * 0.10m; // 10% discount
        }
        else if (type == CustomerType.VIP)
        {
            return amount * 0.20m; // 20% discount
        }

        return 0;
    }
}</code></pre><section class="subsection"><h3>Why this breaks OCP</h3><p>Every time business operations adds a new tier—for example, Employee, BlackFridaySpecial, or Corporate—you have to:</p><ol class="principle-list"><li><span>01</span><p>Modify the <code>CustomerType</code> enum.</p></li><li><span>02</span><p>Edit <code>DiscountCalculator.cs</code> to add a new <code>else if</code> branch.</p></li><li><span>03</span><p>Re-test all existing customer tier calculations to ensure nothing broke.</p></li></ol></section>`
  },
  {
    kicker: "Open / Closed / Refactoring",
    title: "Polymorphism and abstraction.",
    lead: "To satisfy OCP, isolate the changing behavior behind an interface or abstract class.",
    content: `<div class="code-section"><div class="code-label good"><span>1</span><div><strong>Define the Abstraction</strong><small>The stable contract</small></div></div><pre><span class="language">C#</span><code>public interface IDiscountStrategy
{
    decimal CalculateDiscount(decimal amount);
}</code></pre></div><div class="code-section"><div class="code-label good"><span>2</span><div><strong>Implement Concrete Strategies</strong><small>One class per customer tier</small></div></div><p>Each customer tier becomes its own separate class:</p><pre><span class="language">C#</span><code>public class RegularCustomerDiscount : IDiscountStrategy
{
    public decimal CalculateDiscount(decimal amount) => amount * 0.05m;
}

public class PremiumCustomerDiscount : IDiscountStrategy
{
    public decimal CalculateDiscount(decimal amount) => amount * 0.10m;
}

public class VipCustomerDiscount : IDiscountStrategy
{
    public decimal CalculateDiscount(decimal amount) => amount * 0.20m;
}</code></pre></div><div class="code-section"><div class="code-label good"><span>3</span><div><strong>The Calculator</strong><small>Closed for modification</small></div></div><p><code>DiscountCalculator</code> relies on the strategy interface:</p><pre><span class="language">C#</span><code>public class DiscountCalculator
{
    public decimal CalculateDiscount(decimal amount, IDiscountStrategy strategy)
    {
        return strategy.CalculateDiscount(amount);
    }
}</code></pre></div><div class="code-section"><div class="code-label good"><span>4</span><div><strong>Extending Functionality</strong><small>Add, don't modify</small></div></div><p>If business ops wants a new <code>EmployeeDiscount</code> tier:</p><pre><span class="language">C#</span><code>// NEW CODE - Added without modifying any existing classes
public class EmployeeDiscount : IDiscountStrategy
{
    public decimal CalculateDiscount(decimal amount) => amount * 0.30m;
}</code></pre><p>You create a brand new file, write <code>EmployeeDiscount</code>, and pass it in. <code>DiscountCalculator</code> remains completely untouched and requires no re-testing.</p></div>`
  },
  {
    kicker: "Open / Closed / Review",
    title: "Connections and warning signs.",
    lead: "How OCP connects to other principles—and how violations reveal themselves.",
    content: `<div class="concept-list"><section><span>Pattern</span><div><h3>Strategy Pattern</h3><p>Using strategy or state design patterns is the primary mechanism to achieve OCP.</p></div></section><section><span>DIP</span><div><h3>Dependency Inversion Principle</h3><p>OCP relies on depending on abstractions (interfaces) rather than concrete implementations.</p></div></section></div><section class="subsection"><h3>Common Indicators of OCP Violations</h3><div class="table-wrap"><table><thead><tr><th>Code smell</th><th>What it indicates</th></tr></thead><tbody><tr><td><strong>Pervasive switch / if-else blocks</strong></td><td>Checking type tags or enums to execute different logic.</td></tr><tr><td><strong>Cascading changes</strong></td><td>Adding a feature to Class A forces edits in Class B, C, and D.</td></tr><tr><td><strong>Frequent modification of core logic</strong></td><td>Touching stable core modules for minor feature additions.</td></tr></tbody></table></div></section>`
  }
];

const lspPages = [
  {
    kicker: "Chapter three / SOLID / L",
    title: "Liskov Substitution Principle",
    lead: "The L in SOLID stands for the Liskov Substitution Principle (LSP).",
    content: `<p>Formulated by Barbara Liskov in 1987, the principle states:</p><blockquote>“Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.”</blockquote><section class="subsection"><h3>In plain English</h3><p>A derived class (child) must honor the contract established by its base class (parent). If code works with class A, it should continue to work seamlessly if you pass in a subclass B derived from A, without unexpected behavior, errors, or hidden type checks.</p></section><div class="flow"><span>Code expects A</span><b>→</b><span>Receive subclass B</span><b>→</b><span>Behavior remains valid</span></div>`
  },
  {
    kicker: "Liskov Substitution / Classic violation",
    title: "The Square–Rectangle Problem",
    lead: "In basic geometry, a square is a special type of rectangle. Modeling this relationship literally with object-oriented inheritance breaks LSP.",
    content: `<div class="code-label bad"><span>×</span><div><strong>Violation Example</strong><small>Inheritance breaks the behavioral contract</small></div></div><pre><span class="language">C#</span><code>public class Rectangle
{
    public virtual int Width { get; set; }
    public virtual int Height { get; set; }

    public int GetArea() => Width * Height;
}

public class Square : Rectangle
{
    // A square must have equal sides, so setting one sets both
    public override int Width
    {
        get => base.Width;
        set { base.Width = value; base.Height = value; }
    }

    public override int Height
    {
        get => base.Height;
        set { base.Width = value; base.Height = value; }
    }
}</code></pre><section class="subsection"><h3>Why this breaks LSP</h3><p>Look at what happens when client code expects a standard <code>Rectangle</code>:</p><pre><span class="language">C#</span><code>public void ResizeRectangle(Rectangle rect)
{
    rect.Width = 5;
    rect.Height = 4;

    // Expected area for a 5x4 rectangle is 20
    // If rect is actually a Square, setting Height to 4 changed Width to 4!
    // Area becomes 16, breaking the client's expectations.
    Console.WriteLine($"Expected area: 20, Actual area: {rect.GetArea()}");
}</code></pre><p>Passing <code>Square</code> into code expecting <code>Rectangle</code> causes behavioral bugs because <code>Square</code> violates the implicit rules of a <code>Rectangle</code>—that width and height can vary independently.</p></section>`
  },
  {
    kicker: "Liskov Substitution / Runtime failure",
    title: "Throwing NotImplementedException",
    lead: "A frequent real-world code smell is inheriting from an interface or class, but leaving methods unimplemented because the child class doesn't support them.",
    content: `<div class="code-label bad"><span>×</span><div><strong>Violation Example</strong><small>An unsupported inherited operation</small></div></div><pre><span class="language">C#</span><code>public interface IBird
{
    void Fly();
    void Eat();
}

public class Ostrich : IBird
{
    public void Eat() => Console.WriteLine("Eating...");

    // Breaks LSP! Calling this will crash caller code expecting a valid IBird
    public void Fly() => throw new NotImplementedException("Ostriches can't fly!");
}</code></pre><div class="takeaway"><span>The behavioral break</span><p>If caller code iterates over a list of <code>IBird</code> objects calling <code>.Fly()</code>, the <code>Ostrich</code> class explodes with a runtime exception.</p></div>`
  },
  {
    kicker: "Liskov Substitution / Refactoring",
    title: "Model capabilities, not assumptions.",
    lead: "To fix LSP violations, segregate responsibilities or favor composition and smaller abstractions over incorrect inheritance trees.",
    content: `<div class="code-section"><div class="code-label good"><span>1</span><div><strong>Segregate Interfaces</strong><small>Specific capability contracts</small></div></div><p>Break down broad base behaviors into specific capability contracts:</p><pre><span class="language">C#</span><code>public interface IFlyingBird
{
    void Fly();
}

public interface IBird
{
    void Eat();
}</code></pre></div><div class="code-section"><div class="code-label good"><span>2</span><div><strong>Implement Only Supported Interfaces</strong><small>No forced behavior</small></div></div><pre><span class="language">C#</span><code>public class Sparrow : IBird, IFlyingBird
{
    public void Eat() => Console.WriteLine("Sparrow eating...");
    public void Fly() => Console.WriteLine("Sparrow flying...");
}

public class Ostrich : IBird
{
    public void Eat() => Console.WriteLine("Ostrich eating...");
    // No Fly() method forced upon Ostrich
}</code></pre></div><div class="code-section"><div class="code-label good"><span>3</span><div><strong>Client Code</strong><small>Request only what is required</small></div></div><p>Now functions only request what they actually require, eliminating unexpected runtime surprises:</p><pre><span class="language">C#</span><code>public void MakeBirdsFly(IEnumerable&lt;IFlyingBird&gt; flyingBirds)
{
    foreach (var bird in flyingBirds)
    {
        bird.Fly(); // Guaranteed safe to call
    }
}</code></pre></div><section class="subsection"><h3>How to Spot LSP Violations</h3><p>Look out for these flags during code review:</p><div class="table-wrap"><table><thead><tr><th>Code smell</th><th>What it indicates</th></tr></thead><tbody><tr><td><strong>NotImplementedException</strong></td><td>A subclass overrides a method solely to throw an unsupported operation error.</td></tr><tr><td><strong>Type Checking (is, as, instanceof)</strong></td><td>Client code checking concrete types before calling methods—for example, <code>if (bird is Ostrich)</code>.</td></tr><tr><td><strong>Overridden methods that do nothing</strong></td><td>No-op empty implementations overriding parent functionality.</td></tr><tr><td><strong>Weakened preconditions or strengthened postconditions</strong></td><td>Subclasses changing expected input/output constraints established by parent.</td></tr></tbody></table></div></section>`
  }
];

const ispPages = [
  { kicker: "Chapter four / SOLID / I", title: "Interface Segregation Principle", lead: "The I in SOLID stands for the Interface Segregation Principle (ISP).", content: `<p>Coined by Robert C. Martin (“Uncle Bob”), the principle states:</p><blockquote>“Clients should not be forced to depend upon interfaces that they do not use.”</blockquote><section class="subsection"><h3>In plain terms</h3><p>Keep your interfaces small, focused, and tailored to specific needs. It is much better to have many small, specific interfaces than a single, massive “fat” interface.</p></section><div class="flow"><span>Small interface</span><b>→</b><span>Specific client need</span><b>→</b><span>Minimal dependency</span></div>` },
  { kicker: "Interface Segregation / Violation", title: "The “Fat” Interface", lead: "Imagine a document management system where a single interface tries to cover every possible operation on a document.", content: `<div class="code-label bad"><span>×</span><div><strong>Violation Example</strong><small>One interface covers every operation</small></div></div><pre><span class="language">C#</span><code>public interface IDocumentProcessor
{
    void Print();
    void Scan();
    void Fax();
    void ConvertToPdf();
}</code></pre><section class="subsection"><h3>Different types of hardware</h3><p>Now look at what happens when you implement different types of hardware:</p><pre><span class="language">C#</span><code>public class MultiFunctionPrinter : IDocumentProcessor
{
    public void Print() => Console.WriteLine("Printing document...");
    public void Scan() => Console.WriteLine("Scanning document...");
    public void Fax() => Console.WriteLine("Faxing document...");
    public void ConvertToPdf() => Console.WriteLine("Converting to PDF...");
}

public class BasicPrinter : IDocumentProcessor
{
    public void Print() => Console.WriteLine("Printing document...");

    // BasicPrinter can't do these, but is FORCED to implement them!
    public void Scan() => throw new NotImplementedException("Basic printer cannot scan.");
    public void Fax() => throw new NotImplementedException("Basic printer cannot fax.");
    public void ConvertToPdf() => throw new NotImplementedException("Basic printer cannot convert to PDF.");
}</code></pre></section><section class="subsection"><h3>Why this breaks ISP</h3><div class="concept-list"><section><span>01</span><div><h3>Forced Dependencies</h3><p><code>BasicPrinter</code> is forced to depend on methods it doesn't care about.</p></div></section><section><span>02</span><div><h3>LSP Side-Effect</h3><p>Forcing unused methods often leads to <code>NotImplementedException</code>, which breaks the Liskov Substitution Principle.</p></div></section><section><span>03</span><div><h3>Fragile Recompilation</h3><p>If a new operation—for example, <code>OCR()</code>—is added to <code>IDocumentProcessor</code>, every single implementing class must be updated and recompiled—even simple printers that don't support OCR.</p></div></section></div></section>` },
  { kicker: "Interface Segregation / Refactoring", title: "Role interfaces", lead: "Segregate the fat interface into smaller, single-purpose role interfaces.", content: `<div class="code-section"><div class="code-label good"><span>1</span><div><strong>Define Fine-Grained Interfaces</strong><small>One capability per contract</small></div></div><pre><span class="language">C#</span><code>public interface IPrinter
{
    void Print();
}

public interface IScanner
{
    void Scan();
}

public interface IFax
{
    void Fax();
}

public interface IPdfConverter
{
    void ConvertToPdf();
}</code></pre></div><div class="code-section"><div class="code-label good"><span>2</span><div><strong>Implement Only What's Needed</strong><small>Fulfill only supported contracts</small></div></div><p>Classes only implement the contracts they actually fulfill:</p><pre><span class="language">C#</span><code>// Simple printer only implements printing
public class BasicPrinter : IPrinter
{
    public void Print() => Console.WriteLine("Printing document...");
}

// Advanced hardware implements multiple interfaces
public class MultiFunctionPrinter : IPrinter, IScanner, IFax, IPdfConverter
{
    public void Print() => Console.WriteLine("Printing...");
    public void Scan() => Console.WriteLine("Scanning...");
    public void Fax() => Console.WriteLine("Faxing...");
    public void ConvertToPdf() => Console.WriteLine("Converting to PDF...");
}</code></pre></div><div class="code-section"><div class="code-label good"><span>3</span><div><strong>Clients Depend Only on What They Use</strong><small>Request the minimum interface</small></div></div><p>Client code accepts the minimum interface needed to perform its job:</p><pre><span class="language">C#</span><code>public class PrintJobManager
{
    // Requests only IPrinter, so any printer can be passed in without issue
    public void SendJob(IPrinter printer)
    {
        printer.Print();
    }
}</code></pre></div>` },
  { kicker: "Interface Segregation / Review", title: "Thin and client-focused.", lead: "How to spot ISP violations—and how the complete SOLID acronym connects.", content: `<h3>How to Spot ISP Violations</h3><div class="table-wrap"><table><thead><tr><th>Code smell</th><th>What it indicates</th></tr></thead><tbody><tr><td><strong>NotImplementedException</strong></td><td>A class implements an interface method only to throw an exception because it doesn't support the feature.</td></tr><tr><td><strong>Empty Method Bodies</strong></td><td>Interface methods left blank because the implementing class doesn't need them.</td></tr><tr><td><strong>Monolithic Interfaces</strong></td><td>An interface with dozens of methods attempting to serve multiple distinct caller roles.</td></tr><tr><td><strong>Wasted Coupling</strong></td><td>A class depending on a huge interface when it only invokes 1 out of 15 methods.</td></tr></tbody></table></div><section class="subsection"><h3>The Complete SOLID Architecture</h3><p>Now that we have covered all five, here is how the complete acronym connects:</p><div class="solid-map"><article><b>S</b><div><strong>Single Responsibility</strong><p>Classes do one job.</p></div></article><article><b>O</b><div><strong>Open / Closed</strong><p>Add features by extending, not modifying code.</p></div></article><article><b>L</b><div><strong>Liskov Substitution</strong><p>Subclasses honor parent contracts cleanly.</p></div></article><article><b>I</b><div><strong>Interface Segregation</strong><p>Interfaces are thin and client-focused.</p></div></article><article><b>D</b><div><strong>Dependency Inversion</strong><p>High-level code depends on abstractions.</p></div></article></div></section>` }
];

const awaitingContent = (letter, name, chapterNumber) => ({
  kicker: `Chapter ${chapterNumber} / SOLID / ${letter}`,
  title: name,
  lead: "This chapter is ready for your content.",
  content: `<div class="awaiting"><span>${letter}</span><p>Send the material whenever you’re ready, and it will be arranged into focused reading pages.</p></div>`
});

const diFundamentalsPages = [
  {
    kicker: "OOP / Dependency Injection / The Problem",
    title: "What problem does DI solve?",
    lead: "Dependency Injection separates an object from the responsibility of constructing the services it needs.",
    content: `<p>Without DI, classes commonly create concrete dependencies themselves. That decision ties the consumer to one implementation and mixes object construction with business behavior.</p><div class="flow"><span>Consumer</span><b>→</b><span>Creates dependency</span><b>→</b><span>Tight coupling</span></div><section class="takeaway"><span>Core problem</span><p>When a class controls both what dependency it uses and how that dependency is created, changing or isolating the class becomes difficult.</p></section>`
  },
  {
    kicker: "OOP / Dependency Injection / Tight Coupling",
    title: "Without DI: Car creates Engine",
    lead: "The Car constructor directly selects and creates a specific V6Engine.",
    content: `<div class="code-label bad"><span>×</span><div><strong>Tightly coupled</strong><small>Concrete construction inside the consumer</small></div></div><pre><span class="language">C#</span><code>public class Car
{
    private V6Engine _engine;

    public Car()
    {
        // Car is coupled to this specific implementation
        _engine = new V6Engine();
    }
}</code></pre><div class="concept-list"><section><span>01</span><div><h3>Hard to change</h3><p>Switching to an <code>ElectricEngine</code> requires editing the <code>Car</code> class.</p></div></section><section><span>02</span><div><h3>Hard to test</h3><p>A test cannot isolate <code>Car</code> from the real engine, which may perform costly or external work.</p></div></section></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Inversion of Control",
    title: "With DI: receive the Engine",
    lead: "Invert control by accepting an abstraction from outside instead of constructing a concrete dependency.",
    content: `<div class="code-section"><div class="code-label good"><span>1</span><div><strong>Define the abstraction</strong><small>The capability Car requires</small></div></div><pre><span class="language">C#</span><code>public interface IEngine
{
    void Start();
}</code></pre></div><div class="code-section"><div class="code-label good"><span>2</span><div><strong>Use constructor injection</strong><small>The dependency arrives from outside</small></div></div><pre><span class="language">C#</span><code>public class Car
{
    private readonly IEngine _engine;

    public Car(IEngine engine)
    {
        _engine = engine;
    }

    public void Drive()
    {
        _engine.Start();
    }
}</code></pre></div><div class="benefit-grid"><article><strong>Flexibility</strong><p>Car can use a V6Engine, ElectricEngine, or another compatible implementation without changing.</p></article><article><strong>Testability</strong><p>A unit test can supply a fake engine and verify Car in isolation.</p></article></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Core Parts",
    title: "The three roles in DI",
    lead: "A DI system connects an abstraction, an implementation, and an external composition mechanism.",
    content: `<div class="concept-list"><section><span>01</span><div><h3>Service abstraction</h3><p>The contract describing what a component can do—for example, <code>IEngine</code>.</p></div></section><section><span>02</span><div><h3>Implementation</h3><p>The concrete class that performs the work—for example, <code>V6Engine</code> or <code>ElectricEngine</code>.</p></div></section><section><span>03</span><div><h3>Injector or container</h3><p>The external composition system that creates classes and supplies their dependencies.</p></div></section></div><div class="flow"><span>IEngine</span><b>→</b><span>DI container</span><b>→</b><span>Car</span></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Lifetimes",
    title: "Where service lifetimes fit",
    lead: "Once a container owns object creation, it needs instructions for how often to create and reuse each service.",
    content: `<div class="definition-pair"><article><span>Transient</span><div><strong>New every time</strong><p>Create a fresh instance for every resolution.</p></div></article><article><span>Scoped</span><div><strong>One per operation</strong><p>Reuse an instance within the current scope, such as one HTTP request.</p></div></article><article><span>Singleton</span><div><strong>One per application</strong><p>Reuse the same instance for the host process's lifetime.</p></div></article></div><section class="takeaway"><span>Connection</span><p>Dependency Injection moves creation outside the consumer; the registered service lifetime tells the container when that external creation occurs.</p></section>`
  }
];

const diMethodPages = [
  {
    kicker: "OOP / Dependency Injection / Injection Methods",
    title: "Three ways to supply a dependency",
    lead: "Injection types are distinguished by where and when a consuming class receives its dependency.",
    content: `<div class="concept-list"><section><span>01</span><div><h3>Constructor injection</h3><p>Supply required dependencies when the object is created.</p></div></section><section><span>02</span><div><h3>Property injection</h3><p>Assign optional dependencies after object construction.</p></div></section><section><span>03</span><div><h3>Method injection</h3><p>Provide a dependency only to the operation that needs it.</p></div></section></div><section class="takeaway"><span>Default choice</span><p>Prefer constructor injection for required collaborators. Use property or method injection only when their optional or call-specific semantics match the design.</p></section>`
  },
  {
    kicker: "OOP / Dependency Injection / Constructor Injection",
    title: "Constructor injection",
    lead: "Required dependencies are passed to the constructor when the consuming object is instantiated.",
    content: `<pre><span class="language">C#</span><code>public class OrderProcessor
{
    private readonly INotificationService _notifier;

    public OrderProcessor(INotificationService notifier)
    {
        _notifier = notifier
            ?? throw new ArgumentNullException(nameof(notifier));
    }

    public void ProcessOrder(Order order)
    {
        _notifier.SendReceipt(order);
    }
}</code></pre><section class="takeaway"><span>When to use</span><p>The default choice for almost every required class-level dependency.</p></section><div class="benefit-grid"><article><strong>Valid by construction</strong><p>An OrderProcessor cannot be created without its required notification service.</p></article><article><strong>Immutable reference</strong><p>The dependency can be readonly, preventing reassignment after construction.</p></article><article><strong>Explicit contract</strong><p>The constructor clearly communicates everything callers must supply.</p></article></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Property Injection",
    title: "Property or setter injection",
    lead: "A public property receives an optional dependency after the object has already been created.",
    content: `<pre><span class="language">C#</span><code>public class UserProfileComponent
{
    // Optional dependency with a safe default
    public ILogger Logger { get; set; } = new NullLogger();

    public void Render()
    {
        Logger.Log("Rendering profile");
    }
}</code></pre><section class="takeaway"><span>When to use</span><p>Optional dependencies with sensible defaults, or frameworks that require parameterless construction.</p></section><div class="concept-list"><section><span>+</span><div><h3>Useful for optional behavior</h3><p>The class can operate with its fallback when no external implementation is assigned.</p></div></section><section><span>!</span><div><h3>Mutable or invalid state</h3><p>Without a safe default, methods may run before the property is initialized. The dependency can also be replaced unexpectedly later.</p></div></section></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Method Injection",
    title: "Method injection",
    lead: "A dependency is supplied directly to the specific operation that needs it instead of being stored by the class.",
    content: `<pre><span class="language">C#</span><code>public class ReportGenerator
{
    public void Generate(
        ReportData data,
        IReportExporter exporter)
    {
        var formattedData = TransformData(data);
        exporter.Export(formattedData);
    }
}</code></pre><section class="takeaway"><span>When to use</span><p>Dependencies needed by only one method, or strategies whose implementation should vary per invocation.</p></section><div class="benefit-grid"><article><strong>No unnecessary field</strong><p>The class does not retain a collaborator used by only one operation.</p></article><article><strong>Dynamic strategy</strong><p>A caller can pass PdfExporter for one call and CsvExporter for another.</p></article><article><strong>ASP.NET Core</strong><p>Controller actions can request method-level services with <code>[FromServices]</code>; minimal API handlers support service parameter binding.</p></article></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Injection Methods",
    title: "Injection method comparison",
    lead: "Choose the injection point that reflects whether the dependency belongs to the object, is optional, or exists for one call.",
    content: `<div class="table-wrap"><table><thead><tr><th>Injection type</th><th>Requirement</th><th>Lifetime alignment</th><th>Primary use</th></tr></thead><tbody><tr><td><strong>Constructor</strong></td><td>Mandatory</td><td>Consuming class lifetime</td><td>Core service dependencies</td></tr><tr><td><strong>Property</strong></td><td>Optional</td><td>Post-initialization</td><td>Optional features and default fallbacks</td></tr><tr><td><strong>Method</strong></td><td>Call-specific</td><td>Method invocation</td><td>On-demand tools and varying strategies</td></tr></tbody></table></div><section class="takeaway"><span>Decision rule</span><p>If the class cannot do its job without the dependency, require it in the constructor. If the dependency changes per operation, pass it to that method. Reserve property injection for genuinely optional behavior.</p></section>`
  }
];

const manualVsContainerPages = [
  {
    kicker: "OOP / Dependency Injection / Manual vs Container",
    title: "Two ways to compose an object graph",
    lead: "Pure DI wires dependencies directly in application code; container-managed DI builds the same graph from registrations.",
    content: `<div class="definition-pair"><article><span>Manual</span><div><strong>Pure DI</strong><p>You call constructors and pass each dependency explicitly.</p></div></article><article><span>Container</span><div><strong>Container-managed DI</strong><p>You register service mappings and ask a container to resolve the root object.</p></div></article></div><section class="takeaway"><span>Important</span><p>Both approaches use Dependency Injection. A DI container automates object composition, but it is not required to practice DI.</p></section>`
  },
  {
    kicker: "OOP / Dependency Injection / Console Demo / Setup",
    title: "Create the console project",
    lead: "Use the official Microsoft.Extensions.DependencyInjection package without ASP.NET or Web Host infrastructure.",
    content: `<pre><span class="language">Bash</span><code>dotnet new console -n DiBasicsDemo
cd DiBasicsDemo
dotnet add package Microsoft.Extensions.DependencyInjection</code></pre><p>The package provides <code>ServiceCollection</code>, registration extension methods, <code>ServiceProvider</code>, and service-resolution helpers.</p>`
  },
  {
    kicker: "OOP / Dependency Injection / Console Demo / Services",
    title: "Define the object graph",
    lead: "NotificationManager depends on IMessageService, whose EmailService implementation depends on ILogger.",
    content: `<pre><span class="language">C#</span><code>using System;
using Microsoft.Extensions.DependencyInjection;

public interface IMessageService
{
    void SendMessage(string message);
}

public interface ILogger
{
    void Log(string message);
}

public class ConsoleLogger : ILogger
{
    public void Log(string message)
        =&gt; Console.WriteLine($"[LOG]: {message}");
}

public class EmailService : IMessageService
{
    private readonly ILogger _logger;

    public EmailService(ILogger logger)
    {
        _logger = logger;
    }

    public void SendMessage(string message)
    {
        _logger.Log($"Sending Email: '{message}'");
    }
}

public class NotificationManager
{
    private readonly IMessageService _messageService;

    public NotificationManager(IMessageService messageService)
    {
        _messageService = messageService;
    }

    public void NotifyUser(string text)
    {
        _messageService.SendMessage(text);
    }
}</code></pre><div class="flow"><span>NotificationManager</span><b>→</b><span>EmailService</span><b>→</b><span>ConsoleLogger</span></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Console Demo / Manual DI",
    title: "Compose the graph manually",
    lead: "Pure DI creates each object explicitly, beginning with the graph's leaf dependency.",
    content: `<pre><span class="language">C#</span><code>static void RunManualDi()
{
    ILogger logger = new ConsoleLogger();
    IMessageService emailService = new EmailService(logger);
    NotificationManager manager =
        new NotificationManager(emailService);

    manager.NotifyUser("Hello via Manual DI!");
}</code></pre><section class="takeaway"><span>What happens</span><p>The composition root constructs ConsoleLogger, injects it into EmailService, then injects EmailService into NotificationManager.</p></section><div class="benefit-grid"><article><strong>Explicit</strong><p>The complete graph is visible in ordinary C# code.</p></article><article><strong>Simple at small scale</strong><p>No container setup or resolution API is required.</p></article><article><strong>Grows verbose</strong><p>Composition becomes tedious as the graph gains more services and nested dependencies.</p></article></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Console Demo / Container DI",
    title: "Let the container compose the graph",
    lead: "Register mappings and lifetimes, build the provider, and resolve only the root object.",
    content: `<pre><span class="language">C#</span><code>static void RunContainerDi()
{
    // The registration blueprint
    var services = new ServiceCollection();

    services.AddTransient&lt;ILogger, ConsoleLogger&gt;();
    services.AddTransient&lt;IMessageService, EmailService&gt;();
    services.AddTransient&lt;NotificationManager&gt;();

    // Build and own the container
    using ServiceProvider serviceProvider =
        services.BuildServiceProvider();

    // Resolve the root; nested dependencies are automatic
    var manager = serviceProvider
        .GetRequiredService&lt;NotificationManager&gt;();

    manager.NotifyUser("Hello via DI Container!");
}</code></pre><ol class="principle-list"><li><span>A</span><p>Create a <code>ServiceCollection</code> to hold registrations.</p></li><li><span>B</span><p>Map abstractions to implementations and select lifetimes.</p></li><li><span>C</span><p>Build and retain the <code>ServiceProvider</code>.</p></li><li><span>D</span><p>Resolve the root object; the container recursively supplies its dependencies.</p></li></ol>`
  },
  {
    kicker: "OOP / Dependency Injection / Console Demo / Program",
    title: "Run both approaches",
    lead: "One entry point invokes both composition styles so their behavior can be compared directly.",
    content: `<pre><span class="language">C#</span><code>class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine(
            "=== 1. MANUAL DEPENDENCY INJECTION ===");
        RunManualDi();

        Console.WriteLine(
            "\n=== 2. CONTAINER-MANAGED DEPENDENCY INJECTION ===");
        RunContainerDi();
    }

    // RunManualDi and RunContainerDi from the previous pages
}</code></pre><p>Both paths ultimately create the same chain and produce equivalent behavior. The difference is who performs the construction and wiring.</p>`
  },
  {
    kicker: "OOP / Dependency Injection / Manual vs Container",
    title: "Choose the composition style",
    lead: "Use the simplest approach that keeps the application's composition understandable and maintainable.",
    content: `<div class="table-wrap"><table><thead><tr><th>Approach</th><th>Construction</th><th>Strength</th><th>Tradeoff</th></tr></thead><tbody><tr><td><strong>Manual DI</strong><small>Pure DI</small></td><td>Explicit constructor calls</td><td>Transparent and easy to trace</td><td>Verbose for large dependency graphs</td></tr><tr><td><strong>Container DI</strong></td><td>Registration plus root resolution</td><td>Automates nested construction and lifetime management</td><td>Registrations must be kept valid and discoverable</td></tr></tbody></table></div><section class="takeaway"><span>Key takeaway</span><p>Manual DI is often ideal for small graphs. A container becomes valuable as composition, lifetimes, and disposal grow more complex. When the provider is disposed, it also disposes the disposable service instances it owns.</p></section>`
  }
];

const diLifecyclePages = [
  {
    kicker: "OOP / Dependency Injection / Service Lifetimes",
    title: "Service lifetimes in .NET",
    lead: "A service lifetime determines when the built-in DI container creates, shares, and disposes a service instance.",
    content: `<p>Choosing a lifetime defines the boundary within which consumers receive the same object. .NET provides three standard lifetimes: <strong>Transient</strong>, <strong>Scoped</strong>, and <strong>Singleton</strong>.</p><div class="definition-pair"><article><span>Creation</span><div><strong>When is an instance made?</strong><p>On every resolution, once per scope, or once for the application.</p></div></article><article><span>Sharing</span><div><strong>Who receives the same instance?</strong><p>One injection point, one request scope, or every consumer globally.</p></div></article></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Transient",
    title: "Transient — AddTransient",
    lead: "A new instance is created every time the service is requested from the DI container.",
    content: `<p>If three components in the same HTTP request ask for a transient service, the container creates three separate instances.</p><section class="takeaway"><span>Best for</span><p>Lightweight, stateless services with short operations.</p></section><div class="code-section"><div class="code-label good"><span>T</span><div><strong>Registration and usage</strong><small>A fresh instance per resolution</small></div></div><pre><span class="language">C#</span><code>// Registration
builder.Services.AddTransient&lt;ITokenGenerator, TokenGenerator&gt;();

public class OrderService
{
    private readonly ITokenGenerator _tokenGen;

    public OrderService(ITokenGenerator tokenGen)
    {
        _tokenGen = tokenGen;
    }

    public void ProcessOrder()
    {
        var id = _tokenGen.GenerateGuid();
    }
}</code></pre></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Scoped",
    title: "Scoped — AddScoped",
    lead: "A single instance is created once per request or explicitly created scope.",
    content: `<p>In ASP.NET Core, a scope normally corresponds to one incoming HTTP request. Every component requesting the service during that request receives the same instance. It is disposed when the request ends.</p><section class="takeaway"><span>Best for</span><p>State maintained during one operation or request, such as database contexts and unit-of-work handlers.</p></section><div class="code-section"><div class="code-label good"><span>S</span><div><strong>Registration and usage</strong><small>One shared instance per request</small></div></div><pre><span class="language">C#</span><code>// Registration
builder.Services.AddScoped&lt;IOrderRepository, OrderRepository&gt;();

public class CheckoutController : ControllerBase
{
    private readonly IOrderRepository _repo;

    public CheckoutController(IOrderRepository repo)
    {
        _repo = repo;
    }

    [HttpPost]
    public async Task&lt;IActionResult&gt; Checkout(OrderDto dto)
    {
        await _repo.AddAsync(dto);
        await _repo.SaveChangesAsync();
        return Ok();
    }
}</code></pre></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Singleton",
    title: "Singleton — AddSingleton",
    lead: "A single instance remains alive for the entire application process.",
    content: `<p>The instance is created the first time it is requested, or supplied during registration. Every request and component shares it until application shutdown.</p><section class="takeaway"><span>Best for</span><p>Expensive setup resources, thread-safe memory caches, and carefully managed application-wide state.</p></section><div class="code-section"><div class="code-label good"><span>1</span><div><strong>Registration and usage</strong><small>One global shared instance</small></div></div><pre><span class="language">C#</span><code>// Registration
builder.Services.AddSingleton&lt;IMemoryCacheManager, MemoryCacheManager&gt;();

public class ProductCatalogService
{
    private readonly IMemoryCacheManager _cache;

    public ProductCatalogService(IMemoryCacheManager cache)
    {
        _cache = cache;
    }

    public List&lt;Product&gt; GetFeaturedProducts()
    {
        return _cache.GetOrSet(
            "featured_products",
            () =&gt; FetchFromDatabase());
    }
}</code></pre></div>`
  },
  {
    kicker: "OOP / Dependency Injection / Service Lifetimes",
    title: "Lifecycle summary",
    lead: "Match the lifetime to the service's ownership, sharing, and disposal boundary.",
    content: `<div class="table-wrap"><table><thead><tr><th>Lifetime</th><th>Creation point</th><th>Disposal point</th><th>Instance scope</th></tr></thead><tbody><tr><td><strong>Transient</strong></td><td>Every time requested</td><td>When its owning scope is disposed</td><td>Unique per resolution</td></tr><tr><td><strong>Scoped</strong></td><td>Once per request or scope</td><td>End of request or scope</td><td>Shared within the same scope</td></tr><tr><td><strong>Singleton</strong></td><td>Once, on first request or registration</td><td>Application shutdown</td><td>Shared across the application</td></tr></tbody></table></div><section class="takeaway"><span>Rule of thumb</span><p>Use transient for independent stateless work, scoped for request-bound state, and singleton only when the implementation is safe to share concurrently across the entire application.</p></section>`
  }
];

const diGuidDemoPages = [
  {
    kicker: "OOP / Dependency Injection / GUID Demo",
    title: "Visualize DI lifetimes with GUIDs",
    lead: "A unique GUID created by each service instance makes reuse and recreation visible across consumers and HTTP requests.",
    content: `<p>This ASP.NET Core API demo resolves transient, scoped, and singleton services twice during the same request: once in a controller and once through a secondary consumer. Comparing the returned IDs reveals each lifetime boundary.</p><div class="flow"><span>HTTP request</span><b>→</b><span>Controller + SubService</span><b>→</b><span>Compare service IDs</span></div><section class="takeaway"><span>Test method</span><p>Call the endpoint at least twice. First compare the controller and secondary consumer within one response, then compare the two responses.</p></section>`
  },
  {
    kicker: "OOP / Dependency Injection / GUID Demo / Services",
    title: "Interfaces and implementation",
    lead: "Three interfaces allow one implementation type to be registered with three different lifetimes.",
    content: `<p>Each container-created <code>OperationService</code> receives a GUID when its constructor/property initializer runs.</p><pre><span class="language">C#</span><code>public interface ITransientService
{
    Guid Id { get; }
}

public interface IScopedService
{
    Guid Id { get; }
}

public interface ISingletonService
{
    Guid Id { get; }
}

public class OperationService :
    ITransientService,
    IScopedService,
    ISingletonService
{
    public Guid Id { get; } = Guid.NewGuid();
}</code></pre>`
  },
  {
    kicker: "OOP / Dependency Injection / GUID Demo / Registration",
    title: "Register each lifetime",
    lead: "Map each interface to OperationService using its corresponding container registration method.",
    content: `<pre><span class="language">C#</span><code>var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddTransient&lt;ITransientService, OperationService&gt;();
builder.Services.AddScoped&lt;IScopedService, OperationService&gt;();
builder.Services.AddSingleton&lt;ISingletonService, OperationService&gt;();

// A second consumer resolved during the same request
builder.Services.AddTransient&lt;SubService&gt;();

var app = builder.Build();

app.MapControllers();
app.Run();</code></pre><section class="takeaway"><span>Why three interfaces?</span><p>The registration is keyed by service type. Separate interfaces let the container apply a distinct lifetime to each view of the same implementation.</p></section>`
  },
  {
    kicker: "OOP / Dependency Injection / GUID Demo / Consumer",
    title: "Add a secondary consumer",
    lead: "SubService resolves all three lifetimes alongside the controller during the same request.",
    content: `<pre><span class="language">C#</span><code>public class SubService
{
    public ITransientService Transient { get; }
    public IScopedService Scoped { get; }
    public ISingletonService Singleton { get; }

    public SubService(
        ITransientService transient,
        IScopedService scoped,
        ISingletonService singleton)
    {
        Transient = transient;
        Scoped = scoped;
        Singleton = singleton;
    }
}</code></pre><p>The controller and <code>SubService</code> create two resolution points. Transient IDs should differ, while scoped and singleton IDs should match within the response.</p>`
  },
  {
    kicker: "OOP / Dependency Injection / GUID Demo / Controller",
    title: "Return both sets of IDs",
    lead: "The controller exposes its directly injected IDs beside those received by SubService.",
    content: `<pre><span class="language">C#</span><code>using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class LifetimeDemoController : ControllerBase
{
    private readonly ITransientService _transient;
    private readonly IScopedService _scoped;
    private readonly ISingletonService _singleton;
    private readonly SubService _subService;

    public LifetimeDemoController(
        ITransientService transient,
        IScopedService scoped,
        ISingletonService singleton,
        SubService subService)
    {
        _transient = transient;
        _scoped = scoped;
        _singleton = singleton;
        _subService = subService;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            Controller = new
            {
                Transient = _transient.Id,
                Scoped = _scoped.Id,
                Singleton = _singleton.Id
            },
            SubService = new
            {
                Transient = _subService.Transient.Id,
                Scoped = _subService.Scoped.Id,
                Singleton = _subService.Singleton.Id
            }
        });
    }
}</code></pre>`
  },
  {
    kicker: "OOP / Dependency Injection / GUID Demo / Results",
    title: "Compare two requests",
    lead: "The relationships between IDs—not the example GUID values themselves—demonstrate the lifetimes.",
    content: `<div class="code-section"><div class="code-label good"><span>1</span><div><strong>Request 1</strong><small>Controller and SubService in one scope</small></div></div><pre><span class="language">JSON</span><code>{
  "controller": {
    "transient": "11111111-1111-1111-1111-111111111111",
    "scoped":    "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "singleton": "99999999-9999-9999-9999-999999999999"
  },
  "subService": {
    "transient": "22222222-2222-2222-2222-222222222222",
    "scoped":    "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "singleton": "99999999-9999-9999-9999-999999999999"
  }
}</code></pre></div><div class="code-section"><div class="code-label good"><span>2</span><div><strong>Request 2</strong><small>A new request scope</small></div></div><pre><span class="language">JSON</span><code>{
  "controller": {
    "transient": "33333333-3333-3333-3333-333333333333",
    "scoped":    "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    "singleton": "99999999-9999-9999-9999-999999999999"
  },
  "subService": {
    "transient": "44444444-4444-4444-4444-444444444444",
    "scoped":    "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    "singleton": "99999999-9999-9999-9999-999999999999"
  }
}</code></pre></div>`
  },
  {
    kicker: "OOP / Dependency Injection / GUID Demo / Observations",
    title: "Read the GUID pattern",
    lead: "Each lifetime produces a distinct reuse pattern across injection points and requests.",
    content: `<div class="concept-list"><section><span>T</span><div><h3>Transient always changes</h3><p>The controller and SubService receive different IDs in the same request, and both IDs change again on the next request.</p></div></section><section><span>S</span><div><h3>Scoped changes per request</h3><p>Both consumers share one ID within a request. A new request creates a new shared ID.</p></div></section><section><span>1</span><div><h3>Singleton remains constant</h3><p>Every consumer receives the same ID across both requests for the lifetime of the host process.</p></div></section></div>`
  }
];

book.chapters = [
  {
    number: "01",
    title: "Object-Oriented Programming",
    topics: [
      {
        number: "01",
        title: "SOLID",
        sections: [
          { number: "S", title: "Single Responsibility", pages: srpPages },
          { number: "O", title: "Open / Closed", pages: ocpPages },
          { number: "L", title: "Liskov Substitution", pages: lspPages },
          { number: "I", title: "Interface Segregation", pages: ispPages },
          { number: "D", title: "Dependency Inversion", pages: dipPages }
        ]
      },
      {
        number: "02",
        title: "Dependency Injection",
        sections: [
          { number: "01", title: "Why Dependency Injection?", pages: diFundamentalsPages },
          { number: "02", title: "Injection Methods", pages: diMethodPages },
          { number: "03", title: "Manual vs Container DI", pages: manualVsContainerPages },
          { number: "04", title: "Service Lifetimes", pages: diLifecyclePages },
          { number: "05", title: "GUID Controller Demo", pages: diGuidDemoPages }
        ]
      }
    ]
  }
];

globalThis.FOLIO_BOOK = book;
})();
