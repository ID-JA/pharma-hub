# PharmaHub API 🧠

The backend of PharmaHub is developed with [C#](https://dotnet.microsoft.com/en-us/languages/csharp), [.NET 8](https://dotnet.microsoft.com/en-us/download/dotnet/8.0), [ASP.NET Core WebAPI](https://dotnet.microsoft.com/en-us/apps/aspnet/apis). For the database, we use [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads).
## FlowCharts


<details>
  <summary>Create new sale functionality</summary>
  
  ### [Source Code](https://github.com/ID-JA/pharma-hub/blob/cb7e1baa7fd3b3898dfea6174528d4a297092461/PharmaHub.API/Services/Interfaces/ISaleService.cs#L31-L148?plain=1)
 
```mermaid
flowchart TD
    Start --> A[Begin Transaction]
    A --> B[Initialize Sale Object]
    B --> C[Add Sale to DB and Save Changes]
    C --> D[Fetch Inventories]

    D --> E{Inventory Found?}
    E -->|No| F[Mark Out of Stock]
    E -->|Yes| G{Sale Type}

    G -->|Box| H[Adjust Box Quantity]
    G -->|Unit| I[Adjust Unit Quantity]

    H --> J{Out of Stock?}
    J -->|Yes| F
    J -->|No| K[Update SaleMedication Status]

    I --> L{Units < 0?}
    L -->|Yes| M[Calculate Boxes Needed]
    M --> N{Boxes Available?}
    N -->|Yes| O[Adjust Quantities]
    N -->|No| F
    L -->|No| K

    F --> P[Mark SaleMedication as Out of Stock]
    K --> Q[Add SaleMedication to List]
    P --> Q
    O --> Q

    Q --> R[Save SaleMedications to DB]
    R --> S[Record Inventory History]
    S --> T{All Items Processed?}
    T -->|No| G
    T -->|Yes| U[Update Inventories]

    U --> V[Update Sale Status]
    V --> W[Save All Changes]
    W --> X[Commit Transaction]
    X --> End

    F --> End
    F --> T

```
</details>

<details>
  <summary>Cancel entire sale or single sale item functionality</summary>
  
  ### [Source Code](https://github.com/ID-JA/pharma-hub/blob/413ad137686c764cfca4f1f3d46fca20b0be208d/PharmaHub.API/Services/Interfaces/ISaleService.cs#L244-L359?plain=1)
 
```mermaid

flowchart TD
    Start --> A[Begin Transaction]
    A --> B{Fetch Sale and Related Data}
    
    B -->|Sale Not Found| C[Throw Sale Not Found Exception]
    B -->|Sale Found| D{saleItemId.HasValue?}

    D -->|Yes| E[Find SaleMedication]
    E -->|SaleMedication Not Found| F[Throw Sale Item Not Found Exception]
    E -->|SaleMedication Found| G[Adjust Inventory Quantities]
    G --> H[Add InventoryHistory Record for Return]
    H --> I[Update SaleMedication Status to Return and Quantity to Negative]
    I --> J{All SaleMedications Returned?}
    J -->|Yes| K[Update Sale Status to Return]
    J -->|No| L[Proceed to Save Changes]

    D -->|No| M[Group SaleMedications by InventoryId]
    M --> N[Adjust Inventory Quantities]
    N --> O[Add InventoryHistory Records for Return]
    O --> P[Update All SaleMedications Status to Return and Quantities to Negative]
    P --> Q[Update Sale Status to Return]

    Q --> L
    L --> R[Save Changes]
    R --> S[Commit Transaction]
    S --> End

    F --> End
    C --> End
    H --> L

```
</details>


## Copywriter and License
© [Jamal Id Aissa](https://github.com/ID-JA/), [Nazha Haida](https://github.com/nazhahaida)

This project is licensed under the MIT License.