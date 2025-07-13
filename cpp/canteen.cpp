#include <iostream>
#include <string>
#include <queue>
#include <algorithm>
#include <iomanip>

using namespace std;

struct Order {
    string customerName;
    string foodItem;
    int price;
    int waitTime;
};

class CanteenQueue {
    queue<Order> orders;

public:
    void enqueue(string name, string food, int price) {
        Order newOrder;
        newOrder.customerName = name;
        newOrder.foodItem = food;
        newOrder.price = price;

        // Serving time based on food item
        int servingTime = (food == "chai" || food == "coffee" || food == "breadbutter") ? 1 : 2;

        // Calculate current wait time in queue
        int totalWaitTime = 0;
        queue<Order> tempQueue = orders;
        while (!tempQueue.empty()) {
            Order o = tempQueue.front();
            tempQueue.pop();
            totalWaitTime += (o.foodItem == "chai" || o.foodItem == "coffee" || o.foodItem == "breadbutter") ? 1 : 2;
        }

        newOrder.waitTime = totalWaitTime + servingTime;
        orders.push(newOrder);

        cout << "Order placed successfully!\n";
    }

    void serveOrder() {
        if (orders.empty()) {
            cout << "No pending orders to serve.\n";
            return;
        }

        Order servedOrder = orders.front();
        orders.pop();

        cout << "Serving Order: " << servedOrder.customerName
             << " - " << servedOrder.foodItem << "\n";
        cout << "Your total is: " << servedOrder.price << " Rs.\n";
        cout << "Your order was served in " << servedOrder.waitTime << " minute(s).\n";
        cout << "Thank you! Visit again.\n";
    }

    void displayQueue() {
        if (orders.empty()) {
            cout << "No pending orders.\n";
            return;
        }

        cout << "Pending Orders:\n";
        queue<Order> tempQueue = orders;
        while (!tempQueue.empty()) {
            Order order = tempQueue.front();
            tempQueue.pop();

            cout << order.customerName << " - " << order.foodItem
                 << " (Estimated time to serve: " << order.waitTime << " min)\n";
        }
    }
};

void showMenu() {
    string menu[] = {
        "Poha", "Upma", "Chai", "Samosa", "Sandwich",
        "VadaPav", "BreadButter", "Patties", "Coffee", "Biscuits"
    };
    int prices[] = {20, 20, 10, 20, 20, 20, 15, 20, 20, 10};

    cout << "\n===== Welcome to the Canteen! =====\n";
    cout << "====================================\n";
    cout << "               Menu                \n";
    cout << "====================================\n";

    for (int i = 0; i < 10; i++) {
        cout << setw(27) << left << menu[i] 
             << "[" << prices[i] << " Rs]\n";
    }

    cout << "====================================\n";
}

string toLowerCase(string input) {
    transform(input.begin(), input.end(), input.begin(), ::tolower);
    return input;
}

int main() {
    CanteenQueue canteen;
    int choice;
    string customerName, foodItem;
    char moreOrder;

    do {
        cout << "\n===== Options =====\n";
        cout << "1. Place Order\n";
        cout << "2. Serve Order\n";
        cout << "3. View Pending Orders\n";
        cout << "4. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;
        cin.ignore();

        switch (choice) {
            case 1:
                showMenu();
                cout << "\nEnter your name: ";
                getline(cin, customerName);

                do {
                    cout << "Enter your order (food item): ";
                    getline(cin, foodItem);
                    foodItem = toLowerCase(foodItem);

                    int price = 0;
                    if (foodItem == "poha") price = 20;
                    else if (foodItem == "upma") price = 20;
                    else if (foodItem == "chai") price = 10;
                    else if (foodItem == "samosa") price = 20;
                    else if (foodItem == "sandwich") price = 20;
                    else if (foodItem == "vadapav") price = 20;
                    else if (foodItem == "breadbutter" || foodItem == "breadbutter") price = 15;
                    else if (foodItem == "patties") price = 20;
                    else if (foodItem == "coffee") price = 20;
                    else if (foodItem == "biscuits") price = 10;
                    else {
                        cout << "Invalid food item. Please try again.\n";
                        continue;
                    }

                    canteen.enqueue(customerName, foodItem, price);

                    cout << "Would you like to order something else? (y/n): ";
                    cin >> moreOrder;
                    cin.ignore();

                } while (moreOrder == 'y' || moreOrder == 'Y');
                break;

            case 2:
                canteen.serveOrder();
                break;

            case 3:
                canteen.displayQueue();
                break;

            case 4:
                cout << "Exiting... Thank you for visiting! See you soon!\n";
                break;

            default:
                cout << "Invalid option. Please try again.\n";
        }

    } while (choice != 4);

    return 0;
}