//
//  ViewController.swift
//  DirTree
//
//  Created by Emiaostein on 6/19/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        let dics = getUploadResourceList()
        
        println(dics)
        
    }
    
    func getUploadResourceList() -> [[String : String]] {
        
        let fileManger = NSFileManager.defaultManager()
        let mainDirURL = NSBundle.mainBundle().resourceURL?.URLByAppendingPathComponent("main")
        
        var error = NSErrorPointer()
        let mainDirEntries = fileManger.enumeratorAtURL(mainDirURL!, includingPropertiesForKeys: nil, options: NSDirectoryEnumerationOptions.SkipsPackageDescendants | NSDirectoryEnumerationOptions.SkipsHiddenFiles) { (url, error) -> Bool in
            
            println(url.lastPathComponent)
            return true
        }
        
        var dics = [[String : String]]()
        
        while let url = mainDirEntries?.nextObject() as? NSURL {
            
            var flag = ObjCBool(false)
            
            fileManger.fileExistsAtPath(url.path!, isDirectory: &flag)
            
            
            if flag.boolValue == false {
                
                let relativePath = url.pathComponents?.reverse()
                var relative = ""
                for path in relativePath as! [String] {
                    
                    if path != "main" {
                        relative = ("/" + path + relative)
                    } else {
                        break
                    }
                    
                }
                
                let dic = [relative : url.path!]
                dics.append(dic)
            }
        }
        return dics
    }
    
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

