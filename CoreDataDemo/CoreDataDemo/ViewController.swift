//
//  ViewController.swift
//  CoreDataDemo
//
//  Created by Emiaostein on 6/22/15.
//  Copyright © 2015 botai. All rights reserved.
//

import UIKit
import CoreData

class ViewController: UIViewController {

    @IBOutlet weak var tableView: UITableView!
    var persons = [NSManagedObject]()
    override func viewDidLoad() {
        super.viewDidLoad()

        tableView.registerClass(UITableViewCell.self, forCellReuseIdentifier: "Cell")
    }
    
    override func viewWillAppear(animated: Bool) {
        
        let appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
        let managedContext = appDelegate.managedObjectContext
        let fetchRequest = NSFetchRequest(entityName: "Person")
        let sort = NSSortDescriptor(key: "name", ascending: false)
        fetchRequest.sortDescriptors = [sort]

        do {
            let fetchResult = try! managedContext.executeFetchRequest(fetchRequest) as! [NSManagedObject]
            persons = fetchResult
        }
    }
    
    @IBAction func addName(sender: UIBarButtonItem) {
        
        let alert = UIAlertController(title: "add a new name", message: "input your new name", preferredStyle: .Alert)
        
        let saveAction = UIAlertAction(title: "Save", style: UIAlertActionStyle.Default) { (action) -> Void in
            let textFiled = alert.textFields![0] as UITextField
            self.saveName(textFiled.text!)
            self.tableView.reloadData()
        }
        
        let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel) { (action) -> Void in
            
            
        }
        alert.addTextFieldWithConfigurationHandler { (textField) -> Void in
        }
        
        alert.addAction(saveAction)
        alert.addAction(cancelAction)
        
        presentViewController(alert, animated: true) { () -> Void in
        }
    }
    
    func saveName(name: String) {
        
        // context
        let appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
        let manageContext = appDelegate.managedObjectContext
        
        // entity description
        let entity = NSEntityDescription.entityForName("Person", inManagedObjectContext: manageContext)
        
        // entity object
        let person = NSManagedObject(entity: entity!, insertIntoManagedObjectContext: manageContext)
        
        // set attributes
        person.setValue(name, forKey: "name")
        
        // save
        do {
            try manageContext.save()
            persons.insert(person, atIndex: 0)
        } catch let error{
            print(error)
        }
    }
}

// MARK: -
extension ViewController: UITableViewDataSource {
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return persons.count
    }
    
    // Row display. Implementers should *always* try to reuse cells by setting each cell's reuseIdentifier and querying for available reusable cells with dequeueReusableCellWithIdentifier:
    // Cell gets various attributes set automatically based on table (separators) and data source (accessory views, editing controls)
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell")
        
        let person = persons[indexPath.row]
        cell?.textLabel?.text = person.valueForKey("name") as? String
        
        return cell!
    }
}




