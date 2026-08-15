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

book.chapters = [
  { number: "S", title: "Single Responsibility", pages: srpPages },
  { number: "O", title: "Open / Closed", pages: ocpPages },
  { number: "L", title: "Liskov Substitution", pages: lspPages },
  { number: "I", title: "Interface Segregation", pages: ispPages },
  { number: "D", title: "Dependency Inversion", pages: dipPages }
];

const pages = book.chapters.flatMap((chapter, chapterIndex) => chapter.pages.map((page, pageIndex) => ({...page, chapterIndex, pageIndex})));
let current = Math.min(Number(localStorage.getItem("folio-page") || 0), pages.length - 1);
let theme = localStorage.getItem("folio-theme") || "paper";
let readerSize = Math.max(14, Math.min(22, Number(localStorage.getItem("folio-font-size") || 16)));
let pageSoundEnabled = localStorage.getItem("folio-page-sound") !== "0";
const pageEl = document.querySelector("#page");
const settingsDialog = document.querySelector("#settingsDialog");
const pageSoundToggle = document.querySelector("#pageSoundToggle");
let pageAudioContext;

async function playPageSound() {
  if (!pageSoundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  pageAudioContext ||= new AudioContextClass();
  if (pageAudioContext.state === "suspended") {
    try { await pageAudioContext.resume(); }
    catch { return; }
  }
  const oscillator = pageAudioContext.createOscillator();
  const gain = pageAudioContext.createGain();
  const now = pageAudioContext.currentTime;
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(680, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  oscillator.connect(gain).connect(pageAudioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.115);
  oscillator.addEventListener("ended", () => {
    oscillator.disconnect();
    gain.disconnect();
  });
}

function setPage(index) {
  const next = Math.max(0, Math.min(pages.length - 1, index));
  if (next === current) return;
  current = next;
  playPageSound();
  render();
}

function renderContents() {
  document.querySelector("#contents").innerHTML = book.chapters.map((chapter, ci) => `<section class="chapter-group"><button class="chapter-title" data-page="${pages.findIndex(p => p.chapterIndex === ci)}"><span>${chapter.number}</span>${chapter.title}</button>${chapter.pages.map((page, pi) => { const i = pages.findIndex(p => p.chapterIndex === ci && p.pageIndex === pi); return `<button class="page-link ${i === current ? "active" : ""}" data-page="${i}"><span>${String(i + 1).padStart(2,"0")}</span>${page.title}</button>`; }).join("")}</section>`).join("");
  document.querySelectorAll("[data-page]").forEach(button => button.addEventListener("click", () => { setPage(Number(button.dataset.page)); closeMenu(); }));
}
function render() {
  const p = pages[current];
  pageEl.classList.remove("turning"); void pageEl.offsetWidth; pageEl.classList.add("turning");
  pageEl.innerHTML = `<div class="page-number">${String(current + 1).padStart(2,"0")}</div><p class="kicker">${p.kicker}</p><h2>${p.title}</h2><p class="lead">${p.lead}</p><div class="rule"><span></span></div><div class="page-content">${p.content}</div>`;
  document.querySelector("#currentPage").textContent = current + 1;
  document.querySelector("#totalPages").textContent = pages.length;
  document.querySelector("#prevButton").disabled = current === 0;
  document.querySelector("#nextButton").disabled = current === pages.length - 1;
  const progress = Math.round(((current + 1) / pages.length) * 100);
  document.querySelector("#progressLabel").textContent = `${progress}% complete`;
  document.querySelector("#progressBar").style.width = `${progress}%`;
  localStorage.setItem("folio-page", current); renderContents(); pageEl.focus({preventScroll:true});
}
function move(step) { setPage(current + step); }
function openMenu() { document.body.classList.add("menu-open"); }
function closeMenu() { document.body.classList.remove("menu-open"); }
document.querySelector("#prevButton").addEventListener("click", () => move(-1));
document.querySelector("#nextButton").addEventListener("click", () => move(1));
document.querySelector("#menuButton").addEventListener("click", openMenu);
document.querySelector("#closeButton").addEventListener("click", closeMenu);
document.querySelector("#scrim").addEventListener("click", closeMenu);
document.addEventListener("keydown", e => { if (!settingsDialog.open && e.key === "ArrowRight") move(1); if (!settingsDialog.open && e.key === "ArrowLeft") move(-1); if (e.key === "Escape") closeMenu(); });
document.querySelector("#themeButton").addEventListener("click", () => { theme = theme === "paper" ? "night" : theme === "night" ? "mist" : "paper"; document.body.dataset.theme = theme; localStorage.setItem("folio-theme", theme); });
function applyReaderSize() {
  document.documentElement.style.setProperty("--reader-size", `${readerSize}px`);
  document.documentElement.style.setProperty("--code-size", `${Math.max(11, readerSize - 3)}px`);
  document.querySelector("#fontDecrease").disabled = readerSize === 14;
  document.querySelector("#fontIncrease").disabled = readerSize === 22;
  localStorage.setItem("folio-font-size", readerSize);
}
function changeReaderSize(change) {
  readerSize = Math.max(14, Math.min(22, readerSize + change));
  applyReaderSize();
  showToast(`Reading text: ${readerSize}px`);
}
document.querySelector("#fontDecrease").addEventListener("click", () => changeReaderSize(-1));
document.querySelector("#fontIncrease").addEventListener("click", () => changeReaderSize(1));
document.querySelector("#bookmarkButton").addEventListener("click", e => { const key = `folio-bookmark-${current}`; const on = localStorage.getItem(key) !== "1"; localStorage.setItem(key, on ? "1" : "0"); e.currentTarget.classList.toggle("saved", on); showToast(on ? "Page saved" : "Bookmark removed"); });
document.querySelector("#settingsButton").addEventListener("click", () => settingsDialog.showModal());
document.querySelector("#settingsCloseButton").addEventListener("click", () => settingsDialog.close());
settingsDialog.addEventListener("click", event => { if (event.target === settingsDialog) settingsDialog.close(); });
pageSoundToggle.addEventListener("change", () => {
  pageSoundEnabled = pageSoundToggle.checked;
  localStorage.setItem("folio-page-sound", pageSoundEnabled ? "1" : "0");
  if (pageSoundEnabled) playPageSound();
});
function showToast(message) { const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1800); }
pageSoundToggle.checked = pageSoundEnabled;
document.body.dataset.theme = theme; applyReaderSize(); render();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
